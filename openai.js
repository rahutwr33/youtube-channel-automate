const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: ''
});
const openai = new OpenAIApi(configuration);
const Data = require('./data.json');
async function breakParagraph(){
   try {
    const para = Data.newstitle[0].description
    const completion = await openai.createEdit({
        model: "text-moderation-playground",
        input: `break this paragraph\n\\\"${para}`
      });
      console.log(completion.data.choices[0].text);
   } catch (error) {
    console.log('error', error.response.data)
   }
}

breakParagraph();