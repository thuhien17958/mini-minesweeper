import { useImperativeHandle, useEffect, useState, forwardRef} from "react";
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';

import "../game.scss";

const ModalEngame = forwardRef(({status, time, onNewGame}, ref) => {
    let navigate = useNavigate();
    let isMounted = true;
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
        show: () => {
            setVisible(true);
        },
        hide: () => {
            setVisible(false);
        },
        getVisible: () => {
            return visible;
        },
    }));

    useEffect(() => {
        isMounted && Modal.setAppElement('body');
        return () => {
            isMounted = false
        }
    },[])

    return (
        <Modal
            isOpen={visible}
            style={{content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -200%)',
                textAlign: 'center'
                }}}
            contentLabel="Example Modal"
        >
            <h2>YOU {status}!</h2>
            <p>Play time: {time} s </p>
            <button 
                onClick={(e) => { 
                    e.preventDefault();
                    setVisible(false);
                    onNewGame();
                }}
                style={{marginRight: 10}}
            >
                New Game
            </button>
            <button onClick={(e) => {
                e.preventDefault()
                navigate("/")
            }}>Home Screen</button>
        </Modal>
    );
});

export default ModalEngame