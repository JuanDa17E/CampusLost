package com.campuslost.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "respuestas_reclamacion")
public class respuestaReclamacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_respuesta")
    private Integer idRespuesta;

    @ManyToOne
    @JoinColumn(name = "id_intento")
    private intentoReclamacion intento;

    @ManyToOne
    @JoinColumn(name = "id_pregunta_base")
    private preguntaBase preguntaBase;

    @Column(name = "respuesta_dada", nullable = false)
    private String respuestaDada;

    public Integer getIdRespuesta() { return idRespuesta; }
    public void setIdRespuesta(Integer id) { this.idRespuesta = id; }

    public intentoReclamacion getIntento() { return intento; }
    public void setIntento(intentoReclamacion intento) { this.intento = intento; }

    public preguntaBase getPreguntaBase() { return preguntaBase; }
    public void setPreguntaBase(preguntaBase preguntaBase) { this.preguntaBase = preguntaBase; }

    public String getRespuestaDada() { return respuestaDada; }
    public void setRespuestaDada(String respuestaDada) { this.respuestaDada = respuestaDada; }
}