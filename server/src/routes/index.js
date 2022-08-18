const express = require('express');
const axios = require ("axios");

const app= express();

app.get("/films", async (req, res) => {
    try {
        const responseApi = await axios("https://swapi.dev/api/films");
        const movies = await Promise.all(responseApi.data.results.map(async (peli) => {
            return {
                episode_id: peli.episode_id,
                title: peli.title,
                release_date: peli.release_date,
                director: peli.director,
                producer: peli.producer,
                opening_crawl: peli.opening_crawl,
                characters: await Promise.all(peli.characters.map((c) => axios(c).then(res => res.data)
                            .then(data => {
                                return {
                                    name: data.name,
                                    gender: data.gender,
                                    birth_year: data.birth_year,
                                    height: data.height,
                                    mass: data.mass,
                                    id: data.url.slice(29, -1)
                                }
                            })))
            }
        }));
        return res.status(200).send(movies);
        
    } catch (error) {
        console.log(error);        
    }
});

app.get("/character/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const character = await axios(`https://swapi.dev/api/people/${id}`).then(res => res.data)
                            .then(async (info) => {
                                return {
                                    name: info.name,
                                    gender: info.gender,
                                    birth_year: info.birth_year,
                                    height: info.height,
                                    mass: info.mass,
                                    starships: await Promise.all(info.starships.map((s) => axios(s).then(res => res.data)
                                                .then(data => {
                                                    return {
                                                        name: data.name,
                                                        model: data.model,
                                                        starship_class: data.starship_class,
                                                        passengers: data.passengers
                                                    }
                                                })))
                                }
                            });

        return res.status(200).send(character);
    } catch (error) {
        console.log(error);
    }
});

module.exports = app;
