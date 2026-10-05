const express = require('express');
const cors = require('cors');
const supabase = require('./supabase');//importa a conexão com o supabase
const app = express();
const PORT = process.env.PORT || 3000;

//Middleware essencials 
app.use(cors());//Permite que o frontend acesse este backend sm erros de CORS
app.use(express.json());//Permite que o Express entenda requisições com corpo em JSON

//Passo 1: Memória ram do servidor 
let produtosEmMemoria = [
    {id:1, nome: 'Teclado Mecânico RGB', preco: 150.00},
    {id:2, nome: 'Mouse Gamer 3200 DPI', preco: 85.50}
];

//Rota GET
app.get('/produtos', async (req,res) =>{
const {data, error} = await supabase.from('produtos')
    .select('*')
    .order('id', {ascending: true});
    if (error){
        return res.status(500).json({erro: error.massage});
    }
    res.json(data);
});

//Rota POST
app.post('/produtos', (req, res) =>{
    const {nome, preco} = req.body;

    if(!nome || !preco){
        return res.status(400).json({erro: 'Nome e preco são obrigatórios!'});
    }

    const novoProduto = {
        id:Date.now(),//gera um id temporário baseado no timestamp
        nome,
        preco: parseFloat(preco)
    };

    produtosEmMemoria.push(novoProduto);
    console.log(`[POST /produtos] Produto adicionado na RAM: ${novoProduto.nome}`);

    res.status(201).json(novoProduto);
});

//Rota PUT (copiei de uma tarefa realizada por mim na aula anterior de backend)
app.put('/produtos/:id', (req, res) => {
    const { id } = req.params;          
    const { nome, preco } = req.body;   
    const index = produtosEmMemoria.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Produto não encontrado para atualização.' });
    }

    produtosEmMemoria[index] = {
        ...produtosEmMemoria[index],
        nome: nome || produtosEmMemoria[index].nome,
        preco: preco !== undefined ? parseFloat(preco) : produtosEmMemoria[index].preco
    };

    console.log(`[PUT /produtos] Produto atualizado na RAM ID: ${id}`);

    return res.status(200).json({
        mensagem: 'Produto atualizado com sucesso',
        produto: produtosEmMemoria[index]
    });
}); 

// Rota para Deletar um Produto (copiei de uma tarefa realizada por mim na aula anterior de backend)
app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;

    const index = produtosEmMemoria.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Produto não encontrado para exclusão.' })
    }

    produtosEmMemoria.splice(index, 1);

    return res.status(200).json({
        mensagem: `Produto com ID ${id} removido com sucesso!`
    });

});
// Iniciar o servidor 
app.listen(PORT, () => {
    console.log('=====================================================');
    console.log(`Servidor Back-End rodando na nuvem`);
    console.log('Rota de produtos ativa em http://localhost:3000/produtos');
    console.log('Status: MODO MEMÓRIA RAM ATIVO');
    console.log('=====================================================');
});
