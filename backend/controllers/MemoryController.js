const Memory = require("../models/Memory");

const createMemory = async (req, res) => {
    try {
        const {title, description} = req.body;

        const src = `images/${req.file.filename}`;

        // Verifica se os textos e a descrição estão preenchidas
        if(!title || !description) {
            return res.status(400).json({msg: "Por favor, preencha todos os campos."});
        }

        // Criar nova memoria com base nas informações no body da requisição
        const newMemory = new Memory({
            title, src, description
        });

        // Usa a função do moongose para salvar direto no banco
        await newMemory.save();

        res.json({msg: "Memória criada com sucesso!", newMemory});

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Ocorreu um erro!");
        
    }
};

const getMemories = async(req, res) => {
    try {
        
        const memories = await Memory.find();
        
        res.json(memories);

    } catch (error) {
        res.status(500).send("Ocorreu um erro!");
    }
};

module.exports = {
    createMemory, 
    getMemories, 

};