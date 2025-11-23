import { EvaluationResult, EvaluationRun } from '@/types/arena';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ARENA_MODELS } from '@/lib/arena/test-suites';

export class ArenaExportService {
  
  // Export as CSV
  static async exportCSV(results: EvaluationResult[], run: EvaluationRun) {
    const headers = [
      'Model', 'Test', 'Overall Score', 'Prompt Adherence', 
      'Anatomical Integrity', 'Technical Quality', 'Physics/Lighting',
      'Generation Time (ms)', 'Confidence', 'Reasoning', 'Image URL'
    ];
    
    const rows = results
      .filter(r => r.image_url)
      .map(r => [
        r.model_id,
        r.test_id,
        r.judge_score,
        r.criteria_breakdown.prompt_adherence,
        r.criteria_breakdown.anatomical_integrity,
        r.criteria_breakdown.text_accuracy,
        r.criteria_breakdown.physics_lighting,
        r.generation_time_ms,
        r.judge_confidence,
        `"${r.judge_reasoning.replace(/"/g, '""')}"`,
        r.image_url
      ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, `arena-eval-${run.id}-${new Date().toISOString().slice(0,10)}.csv`);
  }
  
  // Export as JSON
  static async exportJSON(results: EvaluationResult[], run: EvaluationRun) {
    const exportData = {
      run_metadata: {
        id: run.id,
        created_at: run.created_at,
        models: run.models,
        tests: run.tests,
        parameters: run.parameters,
        total_generations: run.total_generations
      },
      results: results
        .filter(r => r.image_url)
        .map(r => ({
          model_id: r.model_id,
          test_id: r.test_id,
          scores: {
            overall: r.judge_score,
            criteria: r.criteria_breakdown,
            confidence: r.judge_confidence
          },
          reasoning: {
            summary: r.judge_reasoning,
            detailed: r.detailed_reasoning
          },
          metadata: {
            generation_time_ms: r.generation_time_ms,
            image_url: r.image_url,
            created_at: r.created_at
          }
        })),
      summary: this.generateSummary(results)
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    saveAs(blob, `arena-eval-${run.id}-${new Date().toISOString().slice(0,10)}.json`);
  }
  
  // Export as ZIP with images
  static async exportZIP(results: EvaluationResult[], run: EvaluationRun) {
    const zip = new JSZip();
    
    // Add metadata JSON
    zip.file('metadata.json', JSON.stringify({
      run: run,
      timestamp: new Date().toISOString()
    }, null, 2));
    
    // Add results CSV
    const csv = await this.generateCSVString(results, run);
    zip.file('results.csv', csv);
    
    // Download and add images
    const imgFolder = zip.folder('images');
    
    for (const result of results.filter(r => r.image_url)) {
      try {
        const response = await fetch(result.image_url);
        const blob = await response.blob();
        const filename = `${result.model_id.replace(/\//g, '-')}_${result.test_id}.png`;
        imgFolder?.file(filename, blob);
      } catch (error) {
        console.error(`Failed to download image for ${result.id}:`, error);
      }
    }
    
    // Generate and download ZIP
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `arena-eval-${run.id}-complete.zip`);
  }
  
  // Generate PDF Report
  static async exportPDF(results: EvaluationResult[], run: EvaluationRun) {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Arena Evaluation Report', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Run ID: ${run.id}`, 20, 30);
    doc.text(`Date: ${new Date(run.created_at).toLocaleString()}`, 20, 37);
    doc.text(`Models: ${run.models.length} models tested`, 20, 44);
    doc.text(`Tests: ${run.tests.length} tests`, 20, 51);
    
    // Summary statistics
    let yPos = 65;
    doc.setFontSize(16);
    doc.text('Summary Statistics', 20, yPos);
    yPos += 10;
    
    const summary = this.generateSummary(results);
    doc.setFontSize(11);
    doc.text(`Average Score: ${summary.avg_score.toFixed(2)}/10`, 20, yPos);
    doc.text(`Best Model: ${ARENA_MODELS[summary.best_model]?.name || summary.best_model}`, 20, yPos + 7);
    doc.text(`Avg Generation Time: ${summary.avg_time.toFixed(0)}ms`, 20, yPos + 14);
    
    // Model rankings
    yPos += 30;
    doc.setFontSize(16);
    doc.text('Model Rankings', 20, yPos);
    yPos += 10;
    
    summary.rankings.forEach((rank, idx) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(11);
      const modelName = ARENA_MODELS[rank.model]?.name || rank.model;
      doc.text(`${idx + 1}. ${modelName}: ${rank.avg_score.toFixed(2)}/10`, 20, yPos);
      yPos += 7;
    });
    
    doc.save(`arena-eval-${run.id}-report.pdf`);
  }
  
  private static generateSummary(results: EvaluationResult[]) {
    const successfulResults = results.filter(r => r.image_url);
    const modelScores = new Map<string, number[]>();
    
    successfulResults.forEach(r => {
      if (!modelScores.has(r.model_id)) {
        modelScores.set(r.model_id, []);
      }
      modelScores.get(r.model_id)!.push(r.judge_score);
    });
    
    const rankings = Array.from(modelScores.entries())
      .map(([model, scores]) => ({
        model,
        avg_score: scores.reduce((a, b) => a + b, 0) / scores.length
      }))
      .sort((a, b) => b.avg_score - a.avg_score);
    
    return {
      total_results: successfulResults.length,
      avg_score: successfulResults.reduce((sum, r) => sum + r.judge_score, 0) / successfulResults.length,
      best_model: rankings[0]?.model || 'N/A',
      avg_time: successfulResults.reduce((sum, r) => sum + r.generation_time_ms, 0) / successfulResults.length,
      rankings
    };
  }
  
  private static async generateCSVString(results: EvaluationResult[], run: EvaluationRun): Promise<string> {
    const headers = [
      'Model', 'Test', 'Overall Score', 'Prompt Adherence', 
      'Anatomical Integrity', 'Technical Quality', 'Physics/Lighting',
      'Generation Time (ms)', 'Confidence', 'Reasoning'
    ];
    
    const rows = results
      .filter(r => r.image_url)
      .map(r => [
        r.model_id,
        r.test_id,
        r.judge_score,
        r.criteria_breakdown.prompt_adherence,
        r.criteria_breakdown.anatomical_integrity,
        r.criteria_breakdown.text_accuracy,
        r.criteria_breakdown.physics_lighting,
        r.generation_time_ms,
        r.judge_confidence,
        `"${r.judge_reasoning.replace(/"/g, '""')}"`
      ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}
