import {
  html,
  render,
} from 'https://unpkg.com/htm/preact/standalone.module.js'

import Terminal from './terminal.js'

const obfuscatedEmail = 'bWVAY2Fyc29uZXZhbnMuY2E='

const currentDate = new Date()
const dateOptions = {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}
const localizedDate = currentDate.toLocaleString('en-CA', dateOptions)

const motd = [
  [{text: 'Welcome to the '}, {text: 'carc1n0gen.sh', styles: {color: '#38c6d0'}}, {text: '!'}],
  [{text: 'Today is '}, {text: localizedDate, styles: {fontWeight: 'bold'}}, {text: '.'}],
  [{text: 'Use the command '}, {text: 'help ', styles: {fontWeight: 'bold'}}, {text: 'for a list of commands.'}]
]

const prompt = [
  {text: '[', styles: {color: '#FFFFFC'}},
  {text: 'guest', styles: {color: '#8BE534'}},
  {text: '@', styles: {color: '#77ACDB'}},
  {text: 'carc1n0gen.sh', styles: {color: '#8BE534'}},
  {text: ':', styles: {color: '#FFFFFC'}},
  {text: '~', styles: {color: '#77ACDB'}},
  {text: ']', styles: {color: '#FFFFFC'}},
  {text: '$', styles: {color: '#FFFFFC'}}
]

const commands = {
  contact: (history) => [
    ...history,
    [{text: 'Email: '}, {text: atob(obfuscatedEmail), styles: {fontWeight: 'bold'}}]
  ],
  projects: (history) => [
    ...history,
    [
      {text: html`<a href="https://quickpaste.net" target="_blank">quickpaste.net</a>`},
      {text: ' - yet another code snippet sharing site.'}
    ],
    [
      {text: html`<a href="https://sarcastify.carc1n0gen.sh/" target="_blank">sarcastify.carc1n0gen.sh</a>`},
      {text: ' - mAkE yOuR tExT lOoK lIkE tHiS.'}
    ],
    [
      {text: html`<a href="https://blog.carsonevans.ca" target="_blank">blog.carsonevans.ca</a>`},
      {text: ' - my personal blog.'}
    ]
  ]
}

render(html`
  <${Terminal} 
    motd=${motd}
    prompt=${prompt}
    commands=${commands} 
  />`, document.querySelector('#app')
)
