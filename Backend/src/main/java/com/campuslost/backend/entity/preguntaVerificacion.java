package com.campuslost.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "preguntas_verificacion")
public class preguntaVerificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pregunta")
    private Integer idPregunta;

    @ManyToOne
    @JoinColumn(name = "id_objeto")
    private objeto objeto;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_pregunta_base")
    private preguntaBase preguntaBase;

    @Column(name = "respuesta", nullable = false)
    private String respuesta;

    public Integer getIdPregunta() { return idPregunta; }
    public void setIdPregunta(Integer id) { this.idPregunta = id; }

    public objeto getObjeto() { return objeto; }
    public void setObjeto(objeto objeto) { this.objeto = objeto; }

    public usuario getUsuario() { return usuario; }
    public void setUsuario(usuario usuario) { this.usuario = usuario; }

    public preguntaBase getPreguntaBase() { return preguntaBase; }
    public void setPreguntaBase(preguntaBase preguntaBase) { this.preguntaBase = preguntaBase; }

    public String getRespuesta() { return respuesta; }
    public void setRespuesta(String respuesta) { this.respuesta = respuesta; }
}