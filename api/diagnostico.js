export default async function handler(req, res) {

if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" })
}

try {

const { nicho, audiencia, problema } = req.body

const response = await fetch("https://api.anthropic.com/v1/messages", {

method: "POST",

headers: {
"Content-Type": "application/json",
"x-api-key": process.env.CLAUDE_API_KEY,
"anthropic-version": "2023-06-01"
},

body: JSON.stringify({

model: "claude-3-5-sonnet-latest",

max_tokens: 300,

messages: [
{
role: "user",
content: `Actúa como experto en marketing digital.

Nicho: ${nicho}
Audiencia: ${audiencia}
Problema: ${problema}

Dame:

1 diagnóstico claro
3 ideas de contenido viral`
}
]

})

})

const data = await response.json()

if (!response.ok) {
return res.status(500).json({ error: data })
}

return res.status(200).json({
resultado: data.content[0].text
})

} catch (error) {

return res.status(500).json({
error: error.message
})

}

}
