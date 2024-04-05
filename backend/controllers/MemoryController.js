const Memory = require("../models/Memory");

const fs = require("fs");

const removeIdImage = (memory) => {
    fs.unlink(`public/${memory.src}`, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Imagem excluída do servidor");
        }
    });
};

const createMemory = async (req, res) => {
    try {
        const { title, description } = req.body;

        const src = `images/${req.file.filename}`;

        // Verifica se os textos e a descrição estão preenchidas
        if (!title || !description) {
            return res.status(400).json({ msg: "Por favor, preencha todos os campos." });
        }

        // Criar nova memoria com base nas informações no body da requisição
        const newMemory = new Memory({
            title, src, description
        });

        // Usa a função do moongose para salvar direto no banco
        await newMemory.save();

        res.json({ msg: "Memória criada com sucesso!", newMemory });

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Ocorreu um erro!");

    }
};

const getMemories = async (req, res) => {
    try {

        const memories = await Memory.find();

        res.json(memories);

    } catch (error) {
        res.status(500).send("Ocorreu um erro!");
    }
};

const getMemory = async (req, res) => {
    try {

        const memory = await Memory.findById(req.params.id);

        if (!memory) {
            return res.status(404).json({ msg: "Memória não encontrada!" });
        }

        res.json(memory);
    } catch (error) {
        res.status(500).send("Ocorreu um erro!");
    }
};

const deleteMemory = async (req, res) => {
    try {
        const memory = await Memory.findByIdAndDelete(req.params.id);

        if (!memory) {
            return res.status(404).json({ msg: "Memória não encontrada! " });
        }

        removeIdImage(memory);

        res.json({ msg: "Memória excluída" });

    } catch (error) {
        console.log(error);
        res.status(500).send("Ocorreu um erro!");
    }
};

const updateMemory = async (req, res) => {
    try {
        const { title, description } = req.body;

        let src = null;

        // Adicionar o caminho da imagem
        if (req.file) {
            src = `images/${req.file.filename}`
        }

        const memory = await Memory.findById(req.params.id);

        // Verifica se tem a memoria pelo id
        if (!memory) {
            return res.status(404).json({ msg: "Memória não encontrada! " });
        }

        // Verifica a imagem no servidor e excluir a antiga
        if(src) {
            removeIdImage(memory);
        }

        const updateDate = {}

        if(title) updateDate.title = title;
        if(description) updateDate.description = description;
        if(src) updateDate.src = src;

        const updateMemory = await Memory.findByIdAndUpdate(
            req.params.id,
            updateDate,
            // Retorna o registro atualizado
            { new: true}
        );

        res.json({ updateMemory, msg: "Memória atualizada com sucesso!" });
    } catch (error) {
        res.status(500).send("Ocorreu um erro!");
    }
};

module.exports = {
    createMemory,
    getMemories,
    getMemory,
    deleteMemory,
    updateMemory,
};