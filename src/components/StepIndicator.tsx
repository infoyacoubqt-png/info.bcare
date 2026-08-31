import { Link } from 'react-router-dom'

interface StepIndicatorProps {
  currentStep: number
}

const steps = [
  { num: 1, label: 'بيانات المركبة' },
  { num: 2, label: 'بيانات العميل' },
  { num: 3, label: 'التحقق' },
  { num: 4, label: 'العروض' },
  { num: 5, label: 'الدفع' },
]

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-3 mb-8 overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const isDone = step.num < currentStep
        const isActive = step.num === currentStep
        return (
          <div key={step.num} className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`step-badge ${
                  isActive ? 'step-active' : isDone ? 'step-done' : 'step-todo'
                }`}
              >
                {isDone ? '✓' : step.num}
              </div>
              <span
                className={`text-xs font-bold whitespace-nowrap ${
                  isActive ? 'text-primary-700' : isDone ? 'text-primary-600' : 'text-neutral-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-6 sm:w-12 rounded-full ${
                  isDone ? 'bg-primary-300' : 'bg-neutral-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
