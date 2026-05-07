package com.campuslost.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "preguntas_base")
public class preguntaBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pregunta_base")
    private Integer idPreguntaBase;

    @Column(name = "pregunta", nullable = false)
    private String pregunta;

    @Column(name = "activa")
    private Boolean activa = true;

    public Integer getIdPreguntaBase() { return idPreguntaBase; }
    public void setIdPreguntaBase(Integer id) { this.idPreguntaBase = id; }

    public String getPregunta() { return pregunta; }
    public void setPregunta(String pregunta) { this.pregunta = pregunta; }

    public Boolean getActiva() { return activa; }
    public void setActiva(Boolean activa) { this.activa = activa; }
}