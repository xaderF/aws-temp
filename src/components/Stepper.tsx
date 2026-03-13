import { Children, type HTMLAttributes, type ReactNode, useMemo, useState } from "react";

import "./Stepper.css";

type RenderStepIndicatorArgs = {
  step: number;
  currentStep: number;
  onStepClick: (step: number) => void;
};

type StepperProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonText?: string;
  nextButtonText?: string;
  finalButtonText?: string;
  disableStepIndicators?: boolean;
  hideFooterOnLastStep?: boolean;
  renderStepIndicator?: (args: RenderStepIndicatorArgs) => ReactNode;
};

type StepProps = {
  children: ReactNode;
};

export function Step({ children }: StepProps) {
  return <div className="stepper-step">{children}</div>;
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backButtonText = "Back",
  nextButtonText = "Next",
  finalButtonText = "Complete",
  disableStepIndicators = false,
  hideFooterOnLastStep = false,
  renderStepIndicator,
  ...rest
}: StepperProps) {
  const stepsArray = useMemo(() => Children.toArray(children), [children]);
  const totalSteps = stepsArray.length;
  const safeInitialStep = Math.min(Math.max(initialStep, 1), Math.max(totalSteps, 1));

  const [currentStep, setCurrentStep] = useState(safeInitialStep);
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (step: number) => {
    setCurrentStep(step);
    if (step > totalSteps) {
      onFinalStepCompleted();
      return;
    }
    onStepChange(step);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      updateStep(totalSteps + 1);
      return;
    }
    updateStep(currentStep + 1);
  };

  const handleStepClick = (step: number) => {
    if (disableStepIndicators || step < 1 || step > totalSteps || step === currentStep) {
      return;
    }
    updateStep(step);
  };

  return (
    <div className="stepper-outer" {...rest}>
      <div className={`stepper-shell ${stepCircleContainerClassName}`}>
        <div className={`stepper-indicators ${stepContainerClassName}`}>
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLast = index < totalSteps - 1;

            const indicator = renderStepIndicator ? (
              renderStepIndicator({
                step: stepNumber,
                currentStep,
                onStepClick: handleStepClick,
              })
            ) : (
              <button
                type="button"
                className={`stepper-indicator ${
                  currentStep === stepNumber
                    ? "active"
                    : currentStep > stepNumber
                      ? "complete"
                      : "inactive"
                }`}
                onClick={() => handleStepClick(stepNumber)}
                disabled={disableStepIndicators}
                aria-label={`Go to step ${stepNumber}`}
              >
                {currentStep > stepNumber ? "✓" : stepNumber}
              </button>
            );

            return (
              <div key={stepNumber} className="stepper-indicator-wrap">
                {indicator}
                {isNotLast && <div className={`stepper-connector ${currentStep > stepNumber ? "complete" : ""}`} />}
              </div>
            );
          })}
        </div>

        {!isCompleted && (
          <div className={`stepper-content ${contentClassName}`}>{stepsArray[currentStep - 1]}</div>
        )}

        {!isCompleted && !(hideFooterOnLastStep && isLastStep) && (
          <div className={`stepper-footer ${footerClassName}`}>
            <div className={`stepper-footer-actions ${currentStep === 1 ? "only-next" : "spread"}`}>
              {currentStep !== 1 && (
                <button type="button" onClick={handleBack} className="stepper-btn stepper-btn-back">
                  {backButtonText}
                </button>
              )}
              <button type="button" onClick={handleNext} className="stepper-btn stepper-btn-next">
                {isLastStep ? finalButtonText : nextButtonText}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
