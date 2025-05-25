export const handleCommandNavigation = (event: KeyboardEvent) => {
  if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
    const slashCommand = document.querySelector('#slash-command')
    if (slashCommand) {
      return true
    }
  }
}
