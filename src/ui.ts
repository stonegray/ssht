import { prompt } from "enquirer";

const question = {
    type: "autocomplete",
    name: "country",
    message: "Where to?",
    limit: 5,
    suggest(input, choices) {
        return choices.filter(choice => choice.message.startsWith(input));
    },
    choices: ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola"]
};

prompt(question)
    .then(answer => console.log("Answer:", answer))
    .catch(console.error);
