import Questions from '../../Data/Questions'
import {
    ADD,
    NEXT,
    PREVIOUS,
    REMOVE,
    SET_ANSWER,
    SET_ERROR,
    FINISH,
    SET_DEADEND,
    SET_LAST_ERROR_QUESTION_ID,
    SKIP_TRANSITION,
} from '../actions/wizard'

export const initialState = {
    questions: Questions,
    answers: new Map([]),
    currentQIndex: 0,
    lastErrorQid: null,
    hasErrors: [],
    deadEnd: { reached: false, message: '' },
    finished: false,
    skipTransition: false,
}

export function reducer(state, action) {
    switch (action.type) {
        case ADD:
            if (Array.isArray(action.payload)) {
                return Object.assign({}, state, {
                    questions: [
                        ...state.questions.slice(0, state.currentQIndex),
                        ...action.payload,
                        ...state.questions.slice(state.currentQIndex + 1),
                    ],
                })
            }

            return state

        case REMOVE:
            return Object.assign({}, state, {
                questions: [...state.questions.slice(0, state.currentQIndex), ...state.questions.slice(state.currentQIndex + 1)],
            })

        case NEXT:
            if (state.currentQIndex === state.questions.length - 1) return state

            return Object.assign({}, state, {
                currentQIndex: state.currentQIndex + 1,
            })

        case PREVIOUS:
            if (state.currentQIndex === 0) return state

            const targetIndex = state.currentQIndex - 1

            const history = action.payload.history

            const updatedQuestionsList = history.has(targetIndex) ? history.get(targetIndex) : state.questions

            return Object.assign({}, state, {
                questions: updatedQuestionsList,
                currentQIndex: targetIndex,
            })

        case SET_LAST_ERROR_QUESTION_ID:
            return Object.assign({}, state, {
                lastErrorQid: action.payload.id,
            })

        case SET_ANSWER:
            const questionIndex = state.questions.findIndex(q => q.id === action.payload.qid)

            if (questionIndex === -1) return state

            state.answers.set(action.payload.qid, action.payload.answers)

            return Object.assign({}, state, {
                answers: state.answers,
                hasErrors: state.hasErrors.filter(index => index !== questionIndex),
            })

        case SET_ERROR:
            if (action.payload.set) {
                return Object.assign({}, state, {
                    hasErrors: [...state.hasErrors, action.payload.qIndex],
                })
            }

            return Object.assign({}, state, {
                hasErrors: state.hasErrors.filter(index => index !== action.payload.qIndex),
            })

        case SET_DEADEND:
            return Object.assign({}, state, {
                deadEnd: {
                    reached: action.payload.reached,
                    message: action.payload.message,
                },
            })

        case SKIP_TRANSITION:
            return Object.assign({}, state, {
                skipTransition: action.payload,
            })

        case FINISH:
            return Object.assign({}, state, {
                finished: action.payload,
            })

        default:
            console.error('invalid action', action)

            return state
    }
}
