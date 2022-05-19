import "../game.scss"

export default function Board({size, data, onClick}) {
    return (
        <div className="board" style={{width: size*16, height: size*16}}>
            {
                data.map((value, index) => {
                    return <div 
                                key={`square${index}`} 
                                className={`sprite square ${value}`} 
                                onClick={(e) => {onClick('left', index)}} 
                                onContextMenu={(e) => {
                                    e.preventDefault(); 
                                    onClick('right', index)
                                }}
                            />
                })
            }
        </div>
    );
}