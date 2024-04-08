import axios from "../axios-config";

import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import { toast } from "react-toastify";

import "./Memory.css";

const Memory = () => {

    const { id } = useParams();

    const [memory, setMemory] = useState(null);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const getMemory = async () => {
            const res = await axios.get(`/memories/${id}`);
            setMemory(res.data);
            setComments(res.data.comments);
        };
        getMemory();
    });

    if (!memory) return <p>Carregando...</p>

  return (
    <div className="memory-page">
        <img src={`${axios.defaults.baseURL}${memory.src}`} alt={memory.title} />
        <h2>{memory.title}</h2>
        <p>{memory.description}</p>

        <div className="comment-form">
            <form>
                <label >
                    <input type="text" placeholder="Seu nome"/>
                </label>
                <label >
                    <textarea type="text" placeholder="Seu comentário"></textarea>
                </label>
                <input type="submit" value="Enviar" className="btn" />
            </form>
        </div>

        <div className="comment-container">
            <h3>Comentários ({comments.length})</h3>
            {comments.length === 0 && <p>Não ha comentários</p>}
            {comments.length > 0 &&
                comments.map((comment) => (
                    <div className="comment" key={comment._id}>
                        <p className="comment-name">{comment.name}</p>
                        <p className="comment-text">{comment.text}</p>
                    </div>
                ))}
        </div>

    </div>
  )
}

export default Memory