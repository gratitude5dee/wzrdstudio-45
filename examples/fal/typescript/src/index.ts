import 'dotenv/config';
import * as fal_ai__flux_pro__kontext from './generated/image-to-image/fal-ai__flux-pro__kontext.ts';
import * as fal_ai__flux__dev__image_to_image from './generated/image-to-image/fal-ai__flux__dev__image-to-image.ts';
import * as fal_ai__flux_pro__v1_1_ultra from './generated/text-to-image/fal-ai__flux-pro__v1.1-ultra.ts';
import * as fal_ai__recraft__v3__text_to_image from './generated/text-to-image/fal-ai__recraft__v3__text-to-image.ts';
import * as fal_ai__kling_video__v2__master__image_to_video from './generated/image-to-video/fal-ai__kling-video__v2__master__image-to-video.ts';
import * as fal_ai__wan_effects from './generated/image-to-video/fal-ai__wan-effects.ts';
import * as fal_ai__kling_video__v2_5_turbo__pro__text_to_video from './generated/text-to-video/fal-ai__kling-video__v2.5-turbo__pro__text-to-video.ts';
import * as fal_ai__veo3__fast from './generated/text-to-video/fal-ai__veo3__fast.ts';
import * as bria__video__background_removal from './generated/video-to-video/bria__video__background-removal.ts';
import * as fal_ai__mmaudio_v2 from './generated/video-to-video/fal-ai__mmaudio-v2.ts';
import * as fal_ai__playai__tts__dialog from './generated/text-to-audio/fal-ai__playai__tts__dialog.ts';
import * as fal_ai__minimax_music__v1_5 from './generated/text-to-audio/fal-ai__minimax-music__v1.5.ts';

import * as fal_ai__wan_pro__image_to_video from './generated/image-to-video/fal-ai__wan-pro__image-to-video.ts';
import * as fal_ai__veo2__image_to_video from './generated/image-to-video/fal-ai__veo2__image-to-video.ts';
import * as fal_ai__kling_video__v1_6__pro__image_to_video from './generated/image-to-video/fal-ai__kling-video__v1.6__pro__image-to-video.ts';
import * as fal_ai__minimax__video_01__image_to_video from './generated/image-to-video/fal-ai__minimax__video-01__image-to-video.ts';
import * as fal_ai__wan_25_preview__image_to_video from './generated/image-to-video/fal-ai__wan-25-preview__image-to-video.ts';
import * as fal_ai__kling_video__v2_5_turbo__pro__image_to_video from './generated/image-to-video/fal-ai__kling-video__v2.5-turbo__pro__image-to-video.ts';
import * as fal_ai__flux_krea_trainer from './generated/training/fal-ai__flux-krea-trainer.ts';
import * as fal_ai__flux_kontext_trainer from './generated/training/fal-ai__flux-kontext-trainer.ts';
import * as fal_ai__minimax__hailuo_02__standard__image_to_video from './generated/image-to-video/fal-ai__minimax__hailuo-02__standard__image-to-video.ts';
import * as fal_ai__minimax__hailuo_02__standard__text_to_video from './generated/text-to-video/fal-ai__minimax__hailuo-02__standard__text-to-video.ts';
import * as bria__text_to_image__3_2 from './generated/text-to-image/bria__text-to-image__3.2.ts';
import * as fal_ai__bytedance__seedance__v1__pro__image_to_video from './generated/image-to-video/fal-ai__bytedance__seedance__v1__pro__image-to-video.ts';
import * as fal_ai__imagen4__preview__fast from './generated/text-to-image/fal-ai__imagen4__preview__fast.ts';
import * as fal_ai__veo3 from './generated/text-to-video/fal-ai__veo3.ts';
import * as fal_ai__kling_video__v2_1__master__image_to_video from './generated/image-to-video/fal-ai__kling-video__v2.1__master__image-to-video.ts';
import * as fal_ai__kling_video__v2_1__image_to_video from './generated/image-to-video/fal-ai__kling-video__v2.1__image-to-video.ts';
import * as fal_ai__imagen4 from './generated/text-to-image/fal-ai__imagen4.ts';
import * as fal_ai__kling_video__v2_0__master__text_to_video from './generated/text-to-video/fal-ai__kling-video__v2.0__master__text-to-video.ts';
import * as fal_ai__hidream__i1__full from './generated/text-to-image/fal-ai__hidream__i1__full.ts';
import * as fal_ai__hidream__i1__dev from './generated/text-to-image/fal-ai__hidream__i1__dev.ts';

import * as fal_ai__kling_video__v2_1__standard__image_to_video from './generated/image-to-video/fal-ai__kling-video__v2.1__standard__image-to-video.ts';
import * as fal_ai__imagen4__preview from './generated/text-to-image/fal-ai__imagen4__preview.ts';
import * as fal_ai__kling_video__v2__master__text_to_video from './generated/text-to-video/fal-ai__kling-video__v2__master__text-to-video.ts';
import * as fal_ai__hidream_i1_fast from './generated/text-to-image/fal-ai__hidream-i1-fast.ts';
import * as fal_ai__index_tts_2__text_to_speech from './generated/text-to-speech/fal-ai__index-tts-2__text-to-speech.ts';
import * as fal_ai__elevenlabs__tts__turbo_v2_5 from './generated/text-to-speech/fal-ai__elevenlabs__tts__turbo-v2.5.ts';
import * as fal_ai__elevenlabs__tts__multilingual_v2 from './generated/text-to-audio/fal-ai__elevenlabs__tts__multilingual-v2.ts';
import * as fal_ai__aura_sr from './generated/image-to-image/fal-ai__aura-sr.ts';
import * as fal_ai__clarity_upscaler from './generated/image-to-image/fal-ai__clarity-upscaler.ts';
import * as fal_ai__wan_25_preview__image_to_image from './generated/image-to-image/fal-ai__wan-25-preview__image-to-image.ts';
import * as fal_ai__wan_25_preview__text_to_image from './generated/text-to-image/fal-ai__wan-25-preview__text-to-image.ts';
import * as fal_ai__wan_25_preview__text_to_video from './generated/text-to-video/fal-ai__wan-25-preview__text-to-video.ts';
import * as fal_ai__bytedance__omnihuman__v1_5 from './generated/image-to-video/fal-ai__bytedance__omnihuman__v1.5.ts';
import * as fal_ai__moondream3_preview__caption from './generated/vision/fal-ai__moondream3-preview__caption.ts';
import * as fal_ai__moondream3_preview__query from './generated/vision/fal-ai__moondream3-preview__query.ts';
import * as fal_ai__video_understanding from './generated/vision/fal-ai__video-understanding.ts';
import * as fal_ai__any_llm from './generated/llm/fal-ai__any-llm.ts';
import * as fal_ai__any_llm__enterprise from './generated/llm/fal-ai__any-llm__enterprise.ts';
import * as fal_ai__lynx from './generated/image-to-video/fal-ai__lynx.ts';

import * as fal_ai__image_apps_v2__relighting from './generated/image-to-image/fal-ai__image-apps-v2__relighting.ts';
import * as fal_ai__image_apps_v2__style_transfer from './generated/image-to-image/fal-ai__image-apps-v2__style-transfer.ts';
import * as fal_ai__image_apps_v2__photo_restoration from './generated/image-to-image/fal-ai__image-apps-v2__photo-restoration.ts';
import * as fal_ai__image_apps_v2__portrait_enhance from './generated/image-to-image/fal-ai__image-apps-v2__portrait-enhance.ts';
import * as fal_ai__image_apps_v2__photography_effects from './generated/image-to-image/fal-ai__image-apps-v2__photography-effects.ts';
import * as fal_ai__image_apps_v2__perspective from './generated/image-to-image/fal-ai__image-apps-v2__perspective.ts';
import * as fal_ai__wan_22_vace_fun_a14b__reframe from './generated/video-to-video/fal-ai__wan-22-vace-fun-a14b__reframe.ts';
import * as fal_ai__wan_22_vace_fun_a14b__outpainting from './generated/video-to-video/fal-ai__wan-22-vace-fun-a14b__outpainting.ts';
import * as fal_ai__wan_22_vace_fun_a14b__inpainting from './generated/video-to-video/fal-ai__wan-22-vace-fun-a14b__inpainting.ts';
import * as fal_ai__wan_22_vace_fun_a14b__depth from './generated/video-to-video/fal-ai__wan-22-vace-fun-a14b__depth.ts';
import * as fal_ai__wan_22_vace_fun_a14b__pose from './generated/video-to-video/fal-ai__wan-22-vace-fun-a14b__pose.ts';
import * as perceptron__isaac_01 from './generated/vision/perceptron__isaac-01.ts';

// speech-to-text
import * as fal_ai__whisperx__transcribe from './generated/speech-to-text/fal-ai__whisperx__transcribe.ts';
import * as fal_ai__whisperx__diarize from './generated/speech-to-text/fal-ai__whisperx__diarize.ts';
import * as fal_ai__whisper__large_v3 from './generated/speech-to-text/fal-ai__whisper__large-v3.ts';
import * as deepgram__nova_2__transcribe from './generated/speech-to-text/deepgram__nova-2__transcribe.ts';
import * as assemblyai__universal_2__transcribe from './generated/speech-to-text/assemblyai__universal-2__transcribe.ts';

// 3D
import * as tripo_ai__tripoSR__text_to_3d from './generated/text-to-3d/tripo-ai__tripoSR__text-to-3d.ts';
import * as openai__shap_e__text_to_3d from './generated/text-to-3d/openai__shap-e__text-to-3d.ts';
import * as threestudio__dreamfusion from './generated/text-to-3d/threestudio__dreamfusion.ts';
import * as luma__nerf__image_to_3d from './generated/image-to-3d/luma__nerf__image-to-3d.ts';

// audio-to-video
import * as sadtalker__talking_head from './generated/audio-to-video/sadtalker__talking-head.ts';
import * as wav2lip__lip_sync from './generated/audio-to-video/wav2lip__lip-sync.ts';
import * as animate_anyone__audio_drive from './generated/audio-to-video/animate-anyone__audio-drive.ts';

type Runner = (customInput?: Record<string, unknown>) => Promise<unknown>;

const registry = new Map<string, Runner>([
    ['fal-ai/flux-pro/kontext', fal_ai__flux_pro__kontext.run], // image-to-image
    ['fal-ai/flux/dev/image-to-image', fal_ai__flux__dev__image_to_image.run], // image-to-image
    ['fal-ai/flux-pro/v1.1-ultra', fal_ai__flux_pro__v1_1_ultra.run], // text-to-image
    ['fal-ai/recraft/v3/text-to-image', fal_ai__recraft__v3__text_to_image.run], // text-to-image
    ['fal-ai/kling-video/v2/master/image-to-video', fal_ai__kling_video__v2__master__image_to_video.run], // image-to-video
    ['fal-ai/wan-effects', fal_ai__wan_effects.run], // image-to-video
    ['fal-ai/kling-video/v2.5-turbo/pro/text-to-video', fal_ai__kling_video__v2_5_turbo__pro__text_to_video.run], // text-to-video
    ['fal-ai/veo3/fast', fal_ai__veo3__fast.run], // text-to-video
    ['bria/video/background-removal', bria__video__background_removal.run], // video-to-video
    ['fal-ai/mmaudio-v2', fal_ai__mmaudio_v2.run], // video-to-video
    ['fal-ai/playai/tts/dialog', fal_ai__playai__tts__dialog.run], // text-to-audio
    ['fal-ai/minimax-music/v1.5', fal_ai__minimax_music__v1_5.run], // text-to-audio

    ['fal-ai/wan-pro/image-to-video', fal_ai__wan_pro__image_to_video.run], // image-to-video
    ['fal-ai/veo2/image-to-video', fal_ai__veo2__image_to_video.run], // image-to-video
    ['fal-ai/kling-video/v1.6/pro/image-to-video', fal_ai__kling_video__v1_6__pro__image_to_video.run], // image-to-video
    ['fal-ai/minimax/video-01/image-to-video', fal_ai__minimax__video_01__image_to_video.run], // image-to-video
    ['fal-ai/wan-25-preview/image-to-video', fal_ai__wan_25_preview__image_to_video.run], // image-to-video
    ['fal-ai/kling-video/v2.5-turbo/pro/image-to-video', fal_ai__kling_video__v2_5_turbo__pro__image_to_video.run], // image-to-video
    ['fal-ai/flux-krea-trainer', fal_ai__flux_krea_trainer.run], // training
    ['fal-ai/flux-kontext-trainer', fal_ai__flux_kontext_trainer.run], // training
    ['fal-ai/minimax/hailuo-02/standard/image-to-video', fal_ai__minimax__hailuo_02__standard__image_to_video.run], // image-to-video
    ['fal-ai/minimax/hailuo-02/standard/text-to-video', fal_ai__minimax__hailuo_02__standard__text_to_video.run], // text-to-video
    ['bria/text-to-image/3.2', bria__text_to_image__3_2.run], // text-to-image
    ['fal-ai/bytedance/seedance/v1/pro/image-to-video', fal_ai__bytedance__seedance__v1__pro__image_to_video.run], // image-to-video
    ['fal-ai/imagen4/preview/fast', fal_ai__imagen4__preview__fast.run], // text-to-image
    ['fal-ai/veo3', fal_ai__veo3.run], // text-to-video
    ['fal-ai/kling-video/v2.1/master/image-to-video', fal_ai__kling_video__v2_1__master__image_to_video.run], // image-to-video
    ['fal-ai/kling-video/v2.1/image-to-video', fal_ai__kling_video__v2_1__image_to_video.run], // image-to-video
    ['fal-ai/imagen4', fal_ai__imagen4.run], // text-to-image
    ['fal-ai/kling-video/v2.0/master/text-to-video', fal_ai__kling_video__v2_0__master__text_to_video.run], // text-to-video
    ['fal-ai/hidream/i1/full', fal_ai__hidream__i1__full.run], // text-to-image
    ['fal-ai/hidream/i1/dev', fal_ai__hidream__i1__dev.run], // text-to-image

    ['fal-ai/kling-video/v2.1/standard/image-to-video', fal_ai__kling_video__v2_1__standard__image_to_video.run], // image-to-video
    ['fal-ai/imagen4/preview', fal_ai__imagen4__preview.run], // text-to-image
    ['fal-ai/kling-video/v2/master/text-to-video', fal_ai__kling_video__v2__master__text_to_video.run], // text-to-video
    ['fal-ai/hidream-i1-fast', fal_ai__hidream_i1_fast.run], // text-to-image
    ['fal-ai/index-tts-2/text-to-speech', fal_ai__index_tts_2__text_to_speech.run], // text-to-speech
    ['fal-ai/elevenlabs/tts/turbo-v2.5', fal_ai__elevenlabs__tts__turbo_v2_5.run], // text-to-speech
    ['fal-ai/elevenlabs/tts/multilingual-v2', fal_ai__elevenlabs__tts__multilingual_v2.run], // text-to-audio
    ['fal-ai/aura-sr', fal_ai__aura_sr.run], // image-to-image
    ['fal-ai/clarity-upscaler', fal_ai__clarity_upscaler.run], // image-to-image
    ['fal-ai/wan-25-preview/image-to-image', fal_ai__wan_25_preview__image_to_image.run], // image-to-image
    ['fal-ai/wan-25-preview/text-to-image', fal_ai__wan_25_preview__text_to_image.run], // text-to-image
    ['fal-ai/wan-25-preview/text-to-video', fal_ai__wan_25_preview__text_to_video.run], // text-to-video
    ['fal-ai/bytedance/omnihuman/v1.5', fal_ai__bytedance__omnihuman__v1_5.run], // image-to-video
    ['fal-ai/moondream3-preview/caption', fal_ai__moondream3_preview__caption.run], // vision
    ['fal-ai/moondream3-preview/query', fal_ai__moondream3_preview__query.run], // vision
    ['fal-ai/video-understanding', fal_ai__video_understanding.run], // vision
    ['fal-ai/any-llm', fal_ai__any_llm.run], // llm
    ['fal-ai/any-llm/enterprise', fal_ai__any_llm__enterprise.run], // llm
    ['fal-ai/lynx', fal_ai__lynx.run], // image-to-video

    ['fal-ai/image-apps-v2/relighting', fal_ai__image_apps_v2__relighting.run], // image-to-image
    ['fal-ai/image-apps-v2/style-transfer', fal_ai__image_apps_v2__style_transfer.run], // image-to-image
    ['fal-ai/image-apps-v2/photo-restoration', fal_ai__image_apps_v2__photo_restoration.run], // image-to-image
    ['fal-ai/image-apps-v2/portrait-enhance', fal_ai__image_apps_v2__portrait_enhance.run], // image-to-image
    ['fal-ai/image-apps-v2/photography-effects', fal_ai__image_apps_v2__photography_effects.run], // image-to-image
    ['fal-ai/image-apps-v2/perspective', fal_ai__image_apps_v2__perspective.run], // image-to-image
    ['fal-ai/wan-22-vace-fun-a14b/reframe', fal_ai__wan_22_vace_fun_a14b__reframe.run], // video-to-video
    ['fal-ai/wan-22-vace-fun-a14b/outpainting', fal_ai__wan_22_vace_fun_a14b__outpainting.run], // video-to-video
    ['fal-ai/wan-22-vace-fun-a14b/inpainting', fal_ai__wan_22_vace_fun_a14b__inpainting.run], // video-to-video
    ['fal-ai/wan-22-vace-fun-a14b/depth', fal_ai__wan_22_vace_fun_a14b__depth.run], // video-to-video
    ['fal-ai/wan-22-vace-fun-a14b/pose', fal_ai__wan_22_vace_fun_a14b__pose.run], // video-to-video
    ['perceptron/isaac-01', perceptron__isaac_01.run], // vision

    // speech-to-text
    ['fal-ai/whisperx/transcribe', fal_ai__whisperx__transcribe.run],
    ['fal-ai/whisperx/diarize', fal_ai__whisperx__diarize.run],
    ['fal-ai/whisper/large-v3', fal_ai__whisper__large_v3.run],
    ['deepgram/nova-2/transcribe', deepgram__nova_2__transcribe.run],
    ['assemblyai/universal-2/transcribe', assemblyai__universal_2__transcribe.run],

    // 3D
    ['tripo-ai/tripoSR/text-to-3d', tripo_ai__tripoSR__text_to_3d.run],
    ['openai/shap-e/text-to-3d', openai__shap_e__text_to_3d.run],
    ['threestudio/dreamfusion', threestudio__dreamfusion.run],
    ['luma/nerf/image-to-3d', luma__nerf__image_to_3d.run],

    // audio-to-video
    ['sadtalker/talking-head', sadtalker__talking_head.run],
    ['wav2lip/lip-sync', wav2lip__lip_sync.run],
    ['animate-anyone/audio-drive', animate_anyone__audio_drive.run],
]);

function help() {
  console.log('Usage: ts-node src/index.ts --slug <slug>');
  console.log('Available slugs:');
  for (const [slug] of registry) {
    console.log('  -', slug);
  }
}

async function main() {
  const args = new Map<string, string>();
  for (let i=2; i<process.argv.length; i+=2) {
    args.set(process.argv[i], process.argv[i+1]);
  }
  const slug = args.get('--slug');
  if (!slug) {
    help();
    process.exit(1);
  }
  const run = registry.get(slug);
  if (!run) {
    console.error('Unknown slug:', slug);
    help();
    process.exit(1);
  }
  const result = await run();
  if (result !== undefined) {
    console.log(JSON.stringify(result, null, 2));
  }
}

if (import.meta.main) {
  void main();
}
