import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

export const uploadImagePluginKey = new PluginKey('upload-image')

export const UploadImagesPlugin = ({ imageClass }: { imageClass: string }) =>
  new Plugin({
    key: uploadImagePluginKey,
    state: {
      init() {
        return DecorationSet.empty
      },
      apply(tr, set) {
        set = set.map(tr.mapping, tr.doc)
        // See if the transaction adds or removes any placeholders
        //@ts-expect-error - not yet sure what the type I need here
        const action = tr.getMeta(this)
        if (action?.add) {
          const { id, pos, src } = action.add

          const placeholder = document.createElement('div')
          placeholder.setAttribute('class', 'img-placeholder')
          const image = document.createElement('img')
          image.setAttribute('class', imageClass)
          image.src = src
          placeholder.appendChild(image)
          const deco = Decoration.widget(pos + 1, placeholder, {
            id
          })
          set = set.add(tr.doc, [deco])
        } else if (action?.remove) {
          // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
          set = set.remove(
            set.find(undefined, undefined, spec => spec.id == action.remove.id)
          )
        }
        return set
      }
    },
    props: {
      decorations(state) {
        return this.getState(state)
      }
    }
  })
