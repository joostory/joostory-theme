function makeSummaryFromNpf(contentId, npf) {
  let content = ""
  const img = npf.content.find(it => it.type == 'image')
  if (img) {
    let imgSrc = img['media'][1]['url']
    content = "<div class='npf_row'><div class='npf_col'><img src='" + imgSrc + "' /></div></div>"
  }

  const summary = npf.content.find(it => it['type'] == 'text' && !it['subtype'])
  if (summary) {
    let text = summary['text']
    if (text.length > 100) {
      text = text.substr(0, 100) + "..."
    }
    content += "<p>" + text + "</p>"
  }

  document.getElementById(contentId).innerHTML = content
}
