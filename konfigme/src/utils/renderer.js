import nunjucks from 'nunjucks'

const env = new nunjucks.Environment(null, {
  autoescape: false,
  tags: {},
})

export function renderTemplate(template, values) {
  return env.renderString(template, values)
}
