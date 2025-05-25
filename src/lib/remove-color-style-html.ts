export const removeColorStyleHtml = (htmlString: string) => {
  if (typeof window === 'undefined') return htmlString

  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')

  // Traverse all elements and remove color styles
  doc.querySelectorAll('*').forEach(el => {
    const style = el.getAttribute('style')
    if (style) {
      // Remove the color property from the style
      const newStyle = style
        .split(';')
        .filter(prop => !prop.trim().startsWith('color:'))
        .join(';')

      if (newStyle.trim()) {
        el.setAttribute('style', newStyle)
      } else {
        el.removeAttribute('style')
      }
    }
  })

  return doc.body.innerHTML // Return the sanitized HTML
}
