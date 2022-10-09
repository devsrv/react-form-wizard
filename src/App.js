import { useState, useEffect, useReducer, useRef, useMemo, useCallback } from 'react'
import Sheet from './Components/Sheet'
import Result from './Components/Result'
import { ADD, NEXT, PREVIOUS, REMOVE, FINISH, SET_DEADEND, SET_ERROR, SET_LAST_ERROR_QUESTION_ID, SKIP_TRANSITION } from './Store/actions/wizard'
import AnswerManager from './AnswerManager'
import { initialState, reducer } from './Store/reducers/qna'
import { field } from './Fixed'
import Debug from './Components/Debug'
import Deadend from './Components/Deadend'
import clsx from 'clsx'
import Error from './Components/Error'
import ExclamationOutline from './Components/Svg/ExclamationOutline'
import Spinner from './Components/Svg/Spinner'
import Button from './Components/Button'
import Progress from './Components/Progress'
import Check from './Components/Svg/Check'

export default function App() {
    const [qstnState, dispatch] = useReducer(reducer, initialState)
    const { questions, answers, currentQIndex, lastErrorQid, hasErrors, finished, deadEnd, skipTransition } = qstnState
    const history = useRef(new Map([[0, questions]]))

    const [isSaving, setIsSaving] = useState(false)

    const execModifier = useMemo(
        () => (index, lastAnswers) => {
            const modifier = questions[index]
            const answerManager = AnswerManager.from(questions, answers)

            return modifier(answerManager.answerOf.bind(answerManager), lastAnswers)
        },
        [questions, answers]
    )

    const qAPayload = useCallback(() => {
        return questions.map(question => {
            return {
                question,
                answer: answers.has(question.id)
                    ? [field.CHECKBOX, field.RADIO].includes(question.type)
                        ? answers.get(question.id).map(answerId => {
                              const optionItem = question.options.find(option => option.id === answerId)
                              return optionItem || 'NA'
                          })
                        : answers.get(question.id)
                    : [],
            }
        })
    }, [questions, answers])

    useEffect(() => {
        history.current = history.current.set(currentQIndex, questions)

        if (typeof questions[currentQIndex] !== 'function') return

        const lastAnswers =
            currentQIndex === 0 ? [] : answers.has(questions[currentQIndex - 1].id) ? answers.get(questions[currentQIndex - 1].id) : []

        const response = execModifier(currentQIndex, lastAnswers)

        if (!Array.isArray(response)) {
            if (!response?.allow) {
                dispatch({ type: SET_DEADEND, payload: { reached: true, message: response?.message } })
                return
            }

            dispatch({ type: REMOVE })
            return
        }

        dispatch({ type: ADD, payload: response })
    }, [currentQIndex, questions, answers])

    useEffect(() => {
        if (hasErrors.findIndex(index => index === currentQIndex) >= 0) {
            dispatch({ type: SET_LAST_ERROR_QUESTION_ID, payload: { id: questions[currentQIndex].id } })
            return
        }
    }, [currentQIndex, questions, hasErrors])

    useEffect(() => {
        ;(deadEnd.reached || finished) && dispatch({ type: SKIP_TRANSITION, payload: true })
    }, [deadEnd.reached, finished])

    const next = () => {
        const currentQid = questions[currentQIndex].id
        const isValid = questions[currentQIndex]?.validate(answers.has(currentQid) ? answers.get(currentQid) : [])

        if (!isValid) {
            dispatch({ type: SET_ERROR, payload: { qIndex: currentQIndex, set: true } })
            dispatch({ type: SET_LAST_ERROR_QUESTION_ID, payload: { id: currentQid } })
            return
        }

        dispatch({ type: SET_ERROR, payload: { qIndex: currentQIndex, set: false } })
        dispatch({ type: SET_LAST_ERROR_QUESTION_ID, payload: { id: null } })

        if (currentQIndex < questions.length - 1) dispatch({ type: NEXT })
        else dispatch({ type: FINISH, payload: true })
    }

    const submit = async () => {
        if (!finished || currentQIndex !== questions.length - 1) return

        const response = await saveSubmittedQA()

        if (response && response?.success) alert('all done')
    }

    const previous = () => {
        deadEnd.reached && dispatch({ type: SET_DEADEND, payload: { reached: false, message: '' } })

        if (finished) {
            dispatch({ type: FINISH, payload: false })
            return
        }

        dispatch({ type: PREVIOUS, payload: { history: history.current } })
    }

    const saveSubmittedQA = () => {
        return new Promise((resolve, reject) => {
            setIsSaving(true)

            setTimeout(_ => {
                setIsSaving(false)
                resolve({ success: true })
            }, 3000)

            // fetch('https://jsonplaceholder.typicode.com/todos/1', {
            // 	method: 'GET',
            // })
            // 	.then(res => res.json())
            // 	.then(response => resolve(response))
            // 	.catch(error => reject(error))
            // 	.finally(_ => setIsSaving(false))
        })
    }

    const visibleQuestion = questions[currentQIndex]
    const hasValidationError = hasErrors.findIndex(index => index === currentQIndex) >= 0

    return (
        <div className="relative overflow-hidden">
            <div className="relative pb-16 sm:pb-24">
                <main className="mt-8 mx-auto max-w-7xl px-4 sm:mt-12">
                    {finished ? (
                        <Result getResult={qAPayload} />
                    ) : (
                        <div className="text-center">
                            {deadEnd.reached ? (
                                <Deadend message={deadEnd.message} />
                            ) : (
                                <>
                                    <div className="w-full max-w-md mx-auto text-center mb-20">
                                        <Progress currentIndex={currentQIndex} total={questions.length} />
                                    </div>
                                    <Sheet
                                        lastErrorQid={lastErrorQid}
                                        question={visibleQuestion.title}
                                        currentQstnIndex={currentQIndex}
                                        qid={visibleQuestion.id}
                                        type={visibleQuestion.type}
                                        invalid={hasValidationError}
                                        skipTransition={skipTransition}
                                        options={visibleQuestion.options}
                                        selected={answers.has(visibleQuestion.id) ? answers.get(visibleQuestion.id) : []}
                                        dispatch={dispatch}
                                        answerAttributes={visibleQuestion?.answerAttributes || {}}
                                    />
                                </>
                            )}
                        </div>
                    )}

                    {/* <Debug data={{ index: currentQIndex, length: questions.length - 1 }} /> */}

                    <div className="mt-5 max-w-md mx-auto md:mt-8">
                        <div className="flex flex-col-reverse md:flex-row md:justify-center md:space-y-0 md:space-x-4">
                            {currentQIndex > 0 && (
                                <div className={clsx('rounded-md mt-2 md:mt-0', deadEnd.reached ? 'w-full' : 'basis-1/4')}>
                                    <Button
                                        onClick={previous}
                                        disabled={isSaving}
                                        addClass={clsx('bg-white hover:bg-gray-50', isSaving ? 'cursor-not-allowed text-gray-500' : 'text-gray-700')}>
                                        Previous
                                    </Button>
                                </div>
                            )}

                            {deadEnd.reached || (
                                <div className={clsx('rounded-md', currentQIndex > 0 ? 'basis-3/4' : 'w-full')}>
                                    <Button
                                        onClick={finished ? submit : next}
                                        disabled={isSaving}
                                        addClass={clsx('text-white bg-gray-800', isSaving ? 'bg-opacity-80' : 'hover:bg-gray-900')}>
                                        {finished ? (
                                            <span className="inline-flex items-center">
                                                {isSaving ? (
                                                    <>
                                                        <Spinner className="animate-spin mr-3 h-4 w-4 text-white" /> Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="h-5 w-5 text-white mr-3" /> Confirm
                                                    </>
                                                )}
                                            </span>
                                        ) : (
                                            <div className="flex items-center">
                                                {hasValidationError && <ExclamationOutline />}
                                                {currentQIndex === questions.length - 1 ? 'Finish' : 'Next'}
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>

                        {!deadEnd.reached && hasValidationError && (
                            <div className="mt-4">
                                <Error />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
