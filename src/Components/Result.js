import React, { memo } from 'react'
import clsx from 'clsx'
import { field } from './../Fixed'
import { Transition } from '@headlessui/react'

function Result({ getResult }) {
    return (
        <Transition
            appear={true}
            show={true}
            enter="transition ease-in-out duration-1000 transform"
            enterFrom="opacity-0 translate-y-20"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-20">
            <div className="max-w-7xl mx-auto py-4 md:py-12 sm:px-6 lg:px-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-semibold text-gray-900">Thank you for filling up!</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            please review the answers you've provided and confirm if any correction needed.
                        </p>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            {getResult().map((item, index) => (
                                <div
                                    key={item.question.id}
                                    className={clsx(
                                        'px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6',
                                        index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'
                                    )}>
                                    <dt className="text-sm font-medium text-gray-800">{item.question.title}</dt>
                                    <dd className="mt-2 md:mt-1 font-normal text-sm text-gray-800 sm:col-span-2">
                                        {[field.CHECKBOX, field.RADIO].includes(item.question.type) ? (
                                            item.answer.length > 1 ? (
                                                <p>
                                                    {item.answer.map((answer, index) => (
                                                        <span
                                                            key={answer.id}
                                                            className={clsx('text-sm text-gray-800', {
                                                                'ml-1': index > 0,
                                                            })}>
                                                            {index > 0 && <small className="mx-2">/</small>} {answer.title}
                                                        </span>
                                                    ))}
                                                </p>
                                            ) : (
                                                <p>{item.answer[0].title}</p>
                                            )
                                        ) : (
                                            <p>{item.answer && item.answer[0]}</p>
                                        )}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </Transition>
    )
}

export default memo(Result)
