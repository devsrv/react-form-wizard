import React, { memo, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { field } from './../Fixed'
import Answer from './Answer'
import { Transition } from '@headlessui/react'
import { SKIP_TRANSITION } from './../Store/actions/wizard'

function Sheet(props) {
    const [isShowing, setIsShowing] = useState(false)
    const [currentSheet, setCurrentSheetData] = useState(props)
    const { lastErrorQid, qid, currentQstnIndex, type, invalid, options, selected, dispatch, answerAttributes } = currentSheet
    const shouldAnimate = useRef(false)

    useEffect(() => {
        shouldAnimate.current = true
    }, [props.currentQstnIndex])

    useEffect(() => {
        if (!props.qid) return

        if (props.skipTransition) {
            shouldAnimate.current = false
            props.dispatch({ type: SKIP_TRANSITION, payload: false })
        }
    }, [props.skipTransition, props.qid])

    useEffect(() => {
        if (!props.qid) return

        if (!shouldAnimate.current) {
            setCurrentSheetData(props)
            setIsShowing(true)
            return
        }

        props.lastErrorQid === props.qid && (shouldAnimate.current = false)

        setIsShowing(false)

        const timerID = setTimeout(_ => {
            setCurrentSheetData(props)
            setIsShowing(true)
            shouldAnimate.current = false
        }, 500)

        return () => clearTimeout(timerID)
    }, [props.question, props.lastErrorQid, props.qid, props.invalid, currentSheet.invalid])

    return (
        <div className="min-h-[15rem]">
            <Transition show={isShowing}>
                <Transition.Child
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="opacity-0 -translate-y-20"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-20">
                    <h2 className="text-xl md:text-3xl font-semibold md:font-extrabold tracking-tight text-gray-900">{currentSheet.question}</h2>
                </Transition.Child>

                <Transition.Child
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="opacity-0 -translate-x-20"
                    enterTo="opacity-100 translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="opacity-100 translate-x-0"
                    leaveTo="opacity-0 translate-x-64">
                    <Answer
                        qid={qid}
                        type={type}
                        invalid={invalid}
                        name={`question-${qid}`}
                        options={options}
                        selected={selected}
                        dispatch={dispatch}
                        answerAttributes={answerAttributes}
                    />
                </Transition.Child>
            </Transition>
        </div>
    )
}

Sheet.propTypes = {
    type: PropTypes.oneOf(Object.keys(field)),
}

export default memo(Sheet)
