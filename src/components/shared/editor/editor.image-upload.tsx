import { type EditorState } from '@tiptap/pm/state'
import { DecorationSet, type EditorView } from '@tiptap/pm/view'
import { toast } from 'sonner'

import { uploadImagePluginKey } from './plugins/upload-images'

const findPlaceholder = (state: EditorState, id: string) => {
  const decos = uploadImagePluginKey.getState(state) as DecorationSet
  const found = decos.find(undefined, undefined, spec => spec.id == id)
  return found.length ? found[0]?.from : null
}

type UploadFn = (file: File, view: EditorView, pos: number) => Promise<void>

export const handleImagePaste = (
  view: EditorView,
  event: ClipboardEvent,
  uploadFn: UploadFn
) => {
  if (event.clipboardData?.files.length) {
    event.preventDefault()
    const [file] = Array.from(event.clipboardData.files)
    if (file) uploadFn(file, view, view.state.selection.from)
    return true
  }
  return false
}

export const handleImageDrop = (
  view: EditorView,
  event: DragEvent,
  moved: boolean,
  uploadFn: UploadFn
) => {
  if (!moved && event.dataTransfer?.files.length) {
    event.preventDefault()
    const [file] = Array.from(event.dataTransfer.files)
    const coordinates = view.posAtCoords({
      left: event.clientX,
      top: event.clientY
    })
    if (file) uploadFn(file, view, (coordinates?.pos ?? 1) - 1)
    return true
  }
  return false
}

// const onUpload = async (defaultFile: File) => {

//   // const fileExtension = defaultFile.name.split(".").pop();

//   // const file = new File(
//   //   [defaultFile],
//   //   `${crypto.randomUUID()}.${fileExtension}`,
//   //   {
//   //     type: defaultFile.type,
//   //     lastModified: new Date().getTime(),
//   //   }
//   // );

//   try {

//     // 1. get presigned Upload url
//     // 2. use upload url using put method

//     // await new Promise((resolve, reject) => {
//     //   // Create new XHR instance for each attempt
//     //   const xhr = new XMLHttpRequest();
//     //   xhr.open("PUT", uploadUrl, true);

//     //   xhr.onload = () => {
//     //     if (xhr.status >= 200 && xhr.status < 300) {
//     //       console.log("Uploaded");
//     //       resolve(true);
//     //     } else {
//     //       reject(`Upload failed with status ${xhr.status}`);
//     //     }
//     //   };

//     //   xhr.onerror = () => {
//     //     reject("Upload failed");
//     //   };

//     //   xhr.send(file);
//     // });

//     // 3. finish upload
//     // const finishRes = await $api.POST("/product/finishFileUpload", {
//     //   body: {
//     //     fileBucketId: bucketId,
//     //     fileName: file.name,
//     //   },
//     // });

//     // const cdnUrlObject = finishRes?.data as {
//     //   url: string;
//     // };

//     // if (!cdnUrlObject?.url) {
//     //   throw new Error("Failed to notify backend about upload completion");
//     // }

//     // return await toast.promise(Promise.resolve(cdnUrlObject?.url), {
//     //   loading: "Uploading image...",
//     //   success: "Image uploaded successfully.",
//     //   error: "Upload failed.",
//     // });
//   } catch (error) {
//     console.log(error);
//     throw new Error("Upload failed");
//   }
// };

export const uploadFn = async (
  file: File,
  view: EditorView,
  pos: number,
  onUpload?: (file: File) => Promise<string>
): Promise<void> => {
  if (!file.type.includes('image/') || file.size > 10 * 1024 * 1024) {
    toast.error('Invalid file. Only images up to 10MB are supported.')
    return
  }

  const id = crypto.randomUUID()
  const tr = view.state.tr
  if (!tr.selection.empty) tr.deleteSelection()

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    tr.setMeta(uploadImagePluginKey, { add: { id, pos, src: reader.result } })
    view.dispatch(tr)
  }

  try {
    const src = await onUpload?.(file)
    const imagePos = findPlaceholder(view.state, id)
    if (imagePos == null) return

    const node = view.state.schema.nodes.image?.create({ src })
    if (!node) return

    view.dispatch(
      view.state.tr
        .replaceWith(imagePos, imagePos, node)
        .setMeta(uploadImagePluginKey, { remove: { id } })
    )
  } catch (e) {
    console.log(e)
    view.dispatch(
      view.state.tr.delete(pos, pos).setMeta(uploadImagePluginKey, { remove: { id } })
    )
  }
}
