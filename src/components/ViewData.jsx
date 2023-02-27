import { useState } from 'react'

export default function ViewData(exercises) {
    const [viewData, setViewData] = useState(exercisesToViewData(exercises));


    function exercisesToViewData(exercises) {
        return exercises.map((exercise, index) => {
            return {
                item: exercise,
                matchIndex: index,
                refIndex: index,
                score: 1
            }
        })
    }

    function setValue(data) {
        // check if data array contains items, matchIndex, refIndex, score
        if (data.length > 0 && data[0].hasOwnProperty('item')) {
            setViewData(data);
        } else {
            setViewData(exercisesToViewData(data));
        }
    }


    return {
        viewData,
        setViewData: setValue
    }
}
