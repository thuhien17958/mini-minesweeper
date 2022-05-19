import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { INFO, GAME_STATE, DIRECTTIONS, SQUARE_TYPES, URL } from "../../constants"
import axios from "axios";

import { Board, Modal } from "./components"

export default function Game() {
    let [params] = useSearchParams();
    const modalRef = useRef(null);
    let level = params.getAll("level");
    let size = INFO[level].size;
    let isMounted = true;

    let [data, setData] = useState([]);
    let [statusMap, setStatusMap] = useState(Array(size*size).fill(SQUARE_TYPES.BLANK));
    let [gameState, setGameState] = useState(GAME_STATE.INIT);
    let [bompNumber, setBompNumber] = useState(0);
    let [startTime, setStartTime] = useState(null);
    let [playTime, setPlayTime] = useState(0);
    let [isLoading, setIsLoading] = useState(true);
 
    const checkValidPos = (pos, direction) => {
        const x = Math.floor(pos/size);
        const y = pos - x*size;
        const newX = x + direction[0];
        const newY = y + direction[1];
        return (newX >= 0 && newX < size && newY >= 0 && newY < size) ? (newX*size + newY) : null;
    }

    const initMap = () => {
        setIsLoading(true);
        setGameState(GAME_STATE.INIT);
        setStatusMap(Array(size*size).fill(SQUARE_TYPES.BLANK))
        axios.get(URL, { params: INFO[level] }).then(res => {
            let bomp = res.data.data;
            setBompNumber(bomp.length);
            let map = [];
            bomp.forEach(bompPos => {
                map[bompPos.x * size + bompPos.y] = SQUARE_TYPES.BOMBREVEALED;
            })

            for(let pos = 0; pos < size*size; pos++) {
                statusMap[pos] = SQUARE_TYPES.BLANK;
                if(map[pos] === undefined) {
                    let count = 0;
                    DIRECTTIONS.forEach(direction => {
                        const newPos = checkValidPos(pos, direction);
                        if(newPos !== null && (map[newPos] === SQUARE_TYPES.BOMBREVEALED)) {
                            count++;
                        }
                    })  
                    map[pos] = `open${count}`;
                }
            }

            setData(map);
            setStatusMap(statusMap);
            setIsLoading(false);
        })
    }

    const unlockEmptySquare = (pos, status) => {
        let stack = [pos];
        while (stack.length > 0) {
            let edge = stack[0];
            stack.shift();
            
            DIRECTTIONS.forEach(direction => {
                const newEdge = checkValidPos(edge, direction)
                if(newEdge !== null && status[newEdge] === SQUARE_TYPES.BLANK) {
                    status[newEdge] = data[newEdge];
                    if(data[newEdge] === 'open0') {
                        stack.push(newEdge)
                    }
                }
            })
        }

        return status;
    }

    const updateMap = (pos) => {
        let newStatusMap = [...statusMap];
        if(data[pos] !== SQUARE_TYPES.BOMBREVEALED) {
            newStatusMap[pos] = data[pos];
            if (data[pos] === 'open0') {
                newStatusMap = [...unlockEmptySquare(pos, newStatusMap)];
            }
        } else {
            newStatusMap = [...data]
            newStatusMap[pos] = SQUARE_TYPES.BOMBDEATH;
            setGameState(GAME_STATE.GAMEOVER);
        }
        setStatusMap(newStatusMap)
    }

    const handleFlag = (pos) => {
        if(statusMap[pos] === SQUARE_TYPES.BLANK || statusMap[pos] === SQUARE_TYPES.BOMDFLAGGED) {
            let temp = [...statusMap];
            temp[pos] = statusMap[pos] === SQUARE_TYPES.BLANK ? SQUARE_TYPES.BOMDFLAGGED : SQUARE_TYPES.BLANK;
            setStatusMap(temp)
        }
    }

    const handleClick = (type, pos) => { 
        if(isLoading) return;
        if(gameState === GAME_STATE.INIT) {
            setGameState(GAME_STATE.INGAME);
            setStartTime(Date.now());
        }
        if(type === 'left') {
            if(statusMap[pos] === SQUARE_TYPES.BLANK) {
                updateMap(pos)
            }else {
                let countFlagged = 0;
                let stack = [];
                
                DIRECTTIONS.forEach(direction => {
                    const curPos = checkValidPos(pos, direction)
                    if(curPos !== null) {
                        if(statusMap[curPos] === SQUARE_TYPES.BOMDFLAGGED 
                            && data[curPos] === SQUARE_TYPES.BOMBREVEALED ) {
                            countFlagged++;
                        }else{
                            stack.push(curPos)
                        }
                    }
                })
               
                if(countFlagged == data[pos][4]) {
                    let newStatusMap = [...statusMap];
                    stack.forEach(value => {
                        newStatusMap[value] = data[value];
                        if (data[value] === 'open0') {
                            newStatusMap = [...unlockEmptySquare(value, newStatusMap)];
                        }
                    })
                    setStatusMap(newStatusMap)
                }
            }
        }else{
            handleFlag(pos)
        }
    }

    useEffect(() => {
        isMounted && initMap()
        return () => {
            isMounted = false
        }
    }, [])

    useEffect(() => {
        if(gameState === GAME_STATE.GAMEOVER) {
            modalRef.current.show();
            setPlayTime((Date.now() - startTime)/1000)
        }
    }, [gameState])

    useEffect(() => {
        if(statusMap.length > 0) {
            const blank = statusMap.filter(temp => temp === SQUARE_TYPES.BLANK);
            const flagged = statusMap.filter(temp => temp === SQUARE_TYPES.BOMDFLAGGED);
            if(blank.length === 0 || (blank.length + flagged.length === bompNumber)) {
                setGameState(GAME_STATE.GAMEOVER);
            }
        }
    }, [statusMap])

    return (
        <div className="container">
            {
                isMounted 
                 && data.length > 0 
                 && <Board 
                        size={INFO[level].size} 
                        data={statusMap} 
                        onClick={(type, pos) => handleClick(type, pos) }
                    />
            }
            <Modal 
                ref={modalRef}
                status={statusMap.indexOf(SQUARE_TYPES.BOMBDEATH) !== -1 ? "LOSS" : "WIN"}
                time={playTime}
                onNewGame={() => initMap()}
            />
        </div>
    );
}