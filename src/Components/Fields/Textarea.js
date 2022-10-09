import React, { useState, Fragment, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { SET_ANSWER } from '../../Store/actions/wizard'
import clsx from 'clsx'

export default function Textarea({ qid, dispatch, name, currentContent, invalid, label, placeholder }) {
    const [value, setValue] = useState('')
    const field = useRef(null)

    useEffect(() => {
        if (currentContent && Array.isArray(currentContent) && currentContent[0]) setValue(currentContent[0])
    }, [currentContent])

    useEffect(() => {
        invalid && field.current && field.current.focus()
    }, [invalid])

    const handleChange = e => {
        let content = e.target.value

        setValue(content)

        dispatch({ type: SET_ANSWER, payload: { answers: Array.of(content), qid } })
    }

    return (
        <div className="text-left">
            <label htmlFor={`text-${qid}`} className="block text-md font-medium text-gray-700 cursor-pointer">
                {label}
            </label>
            <div className="mt-2">
                <textarea
                    onChange={handleChange}
                    name={name}
                    value={value}
                    ref={field}
                    placeholder={placeholder}
                    id={`text-${qid}`}
                    rows="4"
                    className={clsx(
                        invalid
                            ? 'placeholder-red-300 focus:ring-red-500 focus:border-red-500 border-red-300 text-red-900'
                            : 'placeholder:text-slate-400 focus:ring-gray-600 focus:border-gray-600 border-gray-300',
                        'placeholder:italic text-sm placeholder:text-sm py-3 px-4 block w-full shadow-sm rounded-md'
                    )}></textarea>
            </div>
        </div>
    )
}

Text.propTypes = {
    qid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    dispatch: PropTypes.func,
    currentContent: PropTypes.array,
}
