import React, { useState, Fragment, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { SET_ANSWER } from '../../Store/actions/wizard'
import { checkboxType } from './../../Fixed'

export default function Checkbox({ qid, dispatch, name, options = [], selected = [] }) {
    const [checkedOptions, setCheckedOptions] = useState([])

    useEffect(() => {
        setCheckedOptions(selected)
    }, [selected])

    const handleChange = (e, value, type = null) => {
        const isResetType = value => {
            return options.findIndex(option => option.value === value && option?.type && option?.type === checkboxType.RESET) >= 0
        }

        const hasType = value => {
            return options.findIndex(option => option.value === value && option?.type) >= 0
        }

        let updatedCheckedState = []

        if (!e.target.checked) {
            updatedCheckedState = checkedOptions.filter(optionVal => optionVal != value).filter(optionVal => !hasType(optionVal))
        } else {
            updatedCheckedState = type
                ? type === checkboxType.ALL
                    ? options.map(optionVal => optionVal.value).filter(optionVal => !isResetType(optionVal))
                    : Array.of(value)
                : [...checkedOptions, value].filter(optionVal => !hasType(optionVal))
        }

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
                            checked={checkedOptions.includes(option.value)}
                            onChange={e => handleChange(e, option.value, option?.type)}
                            name={name}
                            type="checkbox"
                            value={option.value}
                            className="focus:ring-gray-600 h-4 w-4 text-gray-700 border-gray-300 rounded"
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

Checkbox.propTypes = {
    qid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    dispatch: PropTypes.func,
    options: PropTypes.array,
    selected: PropTypes.array,
}
