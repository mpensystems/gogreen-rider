/*
 *Copyright 2025 MP ENSYSTEMS ADVISORY PRIVATE LIMITED.
 *
 *Licensed under the Apache License, Version 2.0 (the "License");
 *you may not use this file except in compliance with the License.
 *You may obtain a copy of the License at
 *
 *http://www.apache.org/licenses/LICENSE-2.0
 *
 *Unless required by applicable law or agreed to in writing, software
 *distributed under the License is distributed on an "AS IS" BASIS,
 *WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *See the License for the specific language governing permissions and
 *limitations under the License.
 */

import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';

const StepProgressContext = createContext();
export const useStepProgress = () => useContext(StepProgressContext);
import localStorage from '@utils/localstorage';

export const StepProgressProvider = ({children}) => {
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.get('currentStep');
    return savedStep ?? 1;
  });

  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    const stepsUpToCurrent = Array.from({length: currentStep}, (_, i) => i + 1);
    setCompletedSteps(stepsUpToCurrent);
  }, [currentStep]);

  const advanceStep = useCallback(
    (step = null) => {
      const newStep = step ?? currentStep;
      if (!completedSteps.includes(newStep)) {
        setCompletedSteps(prev => [...new Set([...prev, newStep])]);
      }
      if (step === null) {
        setCurrentStep(prev => prev + 1);
      } else {
        setCurrentStep(step + 1);
      }
      localStorage.set('currentStep', newStep);
    },
    [currentStep, completedSteps],
  );

  return (
    <StepProgressContext.Provider
      value={{currentStep, completedSteps, advanceStep}}>
      {children}
    </StepProgressContext.Provider>
  );
};
