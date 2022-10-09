import React, { useState, Fragment, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { SET_ANSWER } from '../../Store/actions/wizard'

export default function Radio({ qid, dispatch, name, options = [], selected = [] }) {
    const [checkedOptions, setCheckedOptions] = useState([])

    useEffect(() => {
        setCheckedOptions(selected)
    }, [selected])

    const handleChange = (e, value) => {
        const updatedCheckedState = Array.of(value)

        setCheckedOptions(updatedCheckedState)

        dispatch({
            type: SET_ANSWER,
            payload: { answers: updatedCheckedState, qid },
        })
    }

    return (
        <Fragment>
            {options.map((option, index) => (
                <div key={option.id} className="relative space-x-4 flex items-baseline py-4">
                    <div className="ml-3 h-5">
                        <input
                            id={`choice-${qid}-${index}`}
                            checked={checkedOptions[0] === option.value}
                            onChange={e => handleChange(e, option.value)}
                            name={name}
                            type="radio"
                            value={option.value}
                            className="focus:ring-gray-600 h-4 w-4 text-gray-700 border-gray-300"
                        />
                    </div>
                    <div className="min-w-0 text-sm">
                        <label htmlFor={`choice-${qid}-${index}`} className="font-medium text-gray-700 cursor-pointer">
                            {option.title}
                        </label>
                    </div>
                </div>
            ))}
        </Fragment>
    )
}

Radio.propTypes = {
    qid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    dispatch: PropTypes.func,
    options: PropTypes.array,
    selected: PropTypes.array,
}
