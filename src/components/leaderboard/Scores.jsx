import { v4 as uuidv4 } from "uuid";
import Timer from "../common/Timer"

const Scores = () => {
    const scores = JSON.parse(localStorage.getItem("highScores"));

    return (
        <div className="flex justify-center items-center pt-10">
            <div className="flex flex-col p-5 items-center bg-gray-600 w-min rounded-xl">
                <h1 className="text-xl font-bold">Leaderboard</h1>
                <ol className="list-decimal list">
                    {scores.map((score) => {
                        return (
                            <ScoreItem
                                key={uuidv4()}
                                user={score.user}
                                level={score.level}
                                wordCount={score.wordCount}
                                time={score.time}
                            />
                        );
                    })}
                </ol>
            </div>
        </div>
    );
}

const ScoreItem = (props) => {
    const truncatedUser = props.user.length > 10 ? `${props.user.slice(0, 10)}...` : props.user;

    return (
        <li className="flex gap-5 w-full mt-5">
            <div className="flex">
                <span className="font-bold">User:</span>
                <span className="ml-1 w-32 truncate">{truncatedUser}</span>
            </div>
            <div className="flex">
                <span className="font-bold">Level:</span>
                <span className="ml-1 w-10">{props.level}</span>
            </div>
            <div className="flex">
                <span className="font-bold">Words:</span>
                <span className="ml-1 w-10">{props.wordCount}</span>
            </div>
            <Timer time={props.time} />

        </li>
    );
}

export default Scores;