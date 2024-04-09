import React, { useEffect, useState } from 'react';
import { HeaderMenu } from "../../layouts/Header/HeaderMenu";
import classes from "./BuyFlower.module.css";
import { Image } from '@mantine/core';
import flower from "../../../public/flower.jpg";
import { Button } from '@mantine/core';

export default function BuyFlower() {
    const [flowers, setFlowers] = useState([]);
    const [counts, setCounts] = useState([]);
    const [category, setCategory] = useState("gb");

    useEffect(() => {
        (async () => {
            await setCategory("Ciete");
            console.log(category);
            await getFlowers();
        })();
    }, [category]);

    async function getFlowers() {
        try {
          
            const response = await fetch("https://localhost:7142/api/ProductEntity/Category/" + category);
            const data = await response.json();
            setFlowers(data);
            // Initialize counts array with count 0 for each flower
            setCounts(new Array(data.length).fill(0));

        } catch (error) {
            console.error("Error fetching flowers:", error);
        }
    }

    const increaseCount = (index) => {
        setCounts(prevCounts => {
            const newCounts = [...prevCounts];
            newCounts[index] += 1;
            return newCounts;
        });
    };

    const decreaseCount = (index) => {
        setCounts(prevCounts => {
            const newCounts = [...prevCounts];
            if (newCounts[index] > 0) {
                newCounts[index] -= 1;
            }
            return newCounts;
        });
    };

    const handleGetStartedClick = () => {
        window.location.href = "/pag";
    };

    return (
        <div>
            <div className={classes.header}>
                <HeaderMenu />
            </div>
            <div className={classes.breadcrum}>
                <h2> Tutaj pojawi sie sciezka do pliku </h2>
            </div>
            {flowers.map((flowerItem, index) => (
                <div key={index} className={classes.outerContainer}>
                    <div className={classes.left}>
                        <Image
                            radius="md"
                            src={flower}
                        />
                    </div>
                    <div className={classes.right}>
                        <div>
                            <h4>{flowerItem.name}</h4>
                            <h4>{flowerItem.producer}</h4>
                        </div>
                        <div className={classes.counter}>
                            <Button className={classes.button} variant={"filled"} onClick={() => decreaseCount(index)}>-</Button>
                            <span>{counts[index]}</span>
                            <Button className={classes.button} onClick={() => increaseCount(index)}>+</Button>
                            <Button>Koszyk</Button>
                            <div className={classes.interval}>
                                <h4>Cena: {flowerItem.price} PLN</h4>
                            </div>
                        </div>
                        <div>
                            {flowerItem.description}
                        </div>
                    </div>
                </div>
            ))}
            <div className={classes.recommend}>
                <h3>Polecane</h3>
            </div>
            <div className={classes.footer}>
                <h4> Stopka</h4>
            </div>
        </div>
    );
}
