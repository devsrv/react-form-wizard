import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { field } from './../Fixed'
import Debug from './Debug'
import Checkbox from './Fields/Checkbox'
import Radio from './Fields/Radio'
import Text from './Fields/Text'
import Textarea from './Fields/Textarea'

function Answer({ qid, name, dispatch, answerAttributes, invalid, type = field.TEXT, options = [], selected = [] }) {
    const Choose = type === field.CHECKBOX ? Checkbox : Radio
    const Typing = type === field.TEXT ? Text : Textarea

    return (
        <div className="w-full max-w-md mx-auto my-10">
            {[field.TEXT, field.TEXTAREA].includes(type) && (
                <Typing
                    qid={qid}
                    dispatch={dispatch}
                    name={name}
                    currentContent={selected}
                    invalid={invalid}
                    label={answerAttributes?.label || 'Enter Below'}
                    placeholder={answerAttributes?.placeholder || ''}
                />
            )}

            {[field.CHECKBOX, field.RADIO].includes(type) && (
                <fieldset className="border-b border-gray-200">
                    <div className="divide-y divide-gray-200">
                        <Choose qid={qid} dispatch={dispatch} name={name} selected={selected} options={options} />
                    </div>
                </fieldset>
            )}
        </div>
    )
}

Answer.propTypes = {
    qid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.oneOf(Object.keys(field)),
    options: PropTypes.array,
}

export default memo(Answer)
