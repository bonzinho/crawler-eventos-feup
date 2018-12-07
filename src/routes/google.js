const express = require('express');
const router = express.Router();


// Bibilioteca pra fazer qurequisições diretamente do backend
const request = require('request');
// faz com que seja possivel trabalhar com jquery no backend
const cheerio = require('cheerio');

router.get('/', (req, res) => {
    request('https://sigarra.up.pt/feup/pt/noticias_geral.eventos?p_g_eventos=0', (err, response, body) =>{
        if(err || response.statusCode != 200){
            return;
        }

        // jquery
        let $ = cheerio.load(body); // Faz  o load de toda a página da requisição e guarda em html na variavel
        let data = [];

        $('.topo li').each((key, element) => {
            // sempre que encontrar um novo elemento ".top li"
            let date = $(element).find('b').text();
            let header = $(element).find('a').text();
            let link = $(element).find('a').attr('href');

            data.push({
                date, header, link
            })
        });

        return res.status(200).json(data);

    });
});

module.exports = router;