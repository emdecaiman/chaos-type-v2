import { useState, useEffect } from "react";
import { generate } from "random-words";
import { v4 as uuidv4 } from 'uuid';
import Stats from "./Stats.jsx";
import List from "./List.jsx";
import EndGame from "./EndGame.jsx";
import StartGame from "./StartGame.jsx";
import Input from "./Input.jsx";

const Game = () => {
    const [wordList, setWordList] = useState([]);
    const [lives, setLives] = useState(3);
    const [gameState, setGameState] = useState("start");
    const [wordCount, setWordCount] = useState(0);
    const [wordGeneratedSpeed, setWordGeneratedSpeed] = useState(2000);
    const [level, setLevel] = useState(1);

    // add words every second
    useEffect(() => {
        if (lives > 0 && gameState == "running") {
            const id = setInterval(() => {
                addWord();
            }, wordGeneratedSpeed);
            return () => clearInterval(id);
        } else if (lives <= 0) {
            endGame();
        }

    }, [lives, wordGeneratedSpeed, gameState]); // interval resets everytime wordList changes

    // speeds up word generation
    useEffect(() => {
        if (wordGeneratedSpeed <= 1000) {
            if (wordCount != 0 && wordCount % 10 == 0) {
                setWordGeneratedSpeed(prevSpeed => prevSpeed - 25);
                setLevel(prevLevel = prevLevel + 1);
            }
        } else {
            if (wordCount != 0 && wordCount % 5 == 0) {
                if (wordGeneratedSpeed <= 1500) {
                    setWordGeneratedSpeed(prevSpeed => prevSpeed - 50);
                    setLevel(prevLevel = prevLevel + 1);
                } else if (wordGeneratedSpeed <= 2000) {
                    setWordGeneratedSpeed(prevSpeed => prevSpeed - 100);
                    setLevel(prevLevel = prevLevel + 1);
                }
                // } else {
                //     setWordGeneratedSpeed(prevSpeed => prevSpeed - 200);
                // }
            }
        }
    }, [wordCount]);

    const addWord = () => {
        const newWord = {
            id: uuidv4(),
            text: generate(),
            y: Math.random() * 100,
            x: Math.random() * 100,
            timerId: setTimeout(() => {
                removeWordByTimeout(newWord);
            }, 12000)
        };

        setWordList(prevWordList => [...prevWordList, newWord]);
    }

    const endGame = () => {
        setWordList(prevWordList => {
            prevWordList.forEach(word => clearTimeout(word.timerId));
            return wordList;
        })

        setGameState("end");
    }

    const removeWordByTimeout = (wordToRemove) => {
        clearTimeout(wordToRemove.timerId);

        // functional updates ensure we are working with latest state values
        setWordList(prevWordList => prevWordList.filter(word => word.id !== wordToRemove.id));
        setLives(prevLives => prevLives - 1);

    }

    //
    // functions passed to components
    //
    const handleStartGame = () => {

        setGameState("running");
    }

    const handleRestartGame = () => {
        setGameState("running");
        setWordList([]);
        setLives(3);
        setWordCount(0);
        setWordGeneratedSpeed(2000);
        setLevel(1);
    }

    const handleRemoveWord = (wordToRemoveObj) => {
        setWordList(prevWordList => prevWordList.filter(word => word.id !== wordToRemoveObj.id));
        setWordCount(prevWordCount => prevWordCount + 1);
    }

    return (
        <>
            <div className="block min-[960px]:hidden text-center mt-20">
                <p className="text-lg font-bold text-red-500">Game not available on screens less than 960px wide.</p>
            </div>
            <div className="hidden min-[960px]:block">
                <div className="flex flex-col items-center">
                    <Stats lives={lives} wordCount={wordCount} gameState={gameState} wordList={wordList} speed={wordGeneratedSpeed} level={level}/>
                    <div className="h-[640px] w-[960px] my-5 relative rounded-xl">
                        <StartGame gameState={gameState} onStart={handleStartGame} />
                        <div className="h-full w-full px-20 py-5 bg-white bg-opacity-5 border border-gray-600 rounded-xl shadow-2xl">
                            <List wordList={wordList} gameState={gameState} />
                        </div>
                        <EndGame gameState={gameState} onRestart={handleRestartGame} />
                    </div>
                    <Input wordList={wordList} handleRemoveWord={handleRemoveWord} gameState={gameState} />
                </div>
            </div>
            <div className="block text-center max-w-[960px] mt-20 mx-auto">
                <h1 className="font-bold mb-5">How To Play!</h1>
                <p>Chaos Type is designed as a fast-paced typing exercise aimed to improve your typing skills and reaction time. 
                    Words will randomly appear on the game screen, and your objective is to type them correctly before
                    they disappear. You begin the game with three lives, and the game speeds up as you progress. If you lose all your
                    lives, the game ends.
                </p>
            </div>

        </>
    );
}

export default Game;