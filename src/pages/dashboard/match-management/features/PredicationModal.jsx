import { Formik, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { X } from "lucide-react";
import { useUpdatePredictionMutation } from '../../../../services/Api';
import { toast } from 'react-toastify';
const predictionSchema = Yup.object().shape({
  booleanOutcomes: Yup.object().shape({
    homeWinBoolean: Yup.boolean(),
    drawBoolean: Yup.boolean(),
    awayWinBoolean: Yup.boolean(),
    over25Boolean: Yup.boolean(),
    under25Boolean: Yup.boolean(),
  }),
  corners: Yup.string()
    .matches(/^\d*\.?\d*$/, 'Must be a valid number')
    .nullable(),
  showFlags: Yup.object().shape({
    homeWinShow: Yup.boolean(),
    awayWinShow: Yup.boolean(),
    drawShow: Yup.boolean(),
    bttsShow: Yup.boolean(),
    overCornersShow: Yup.boolean(),
    over25Show: Yup.boolean()
  })
});

// Prediction Form Component
const PredictionForm = ({ match, onClose, isLoading }) => {
  const { values, setFieldValue, handleSubmit, isSubmitting } = useFormikContext();

  const ToggleSwitch = ({ flag }) => {
    const isChecked = values.showFlags && values.showFlags[flag];
    return (
      <button
        type="button"
        onClick={() => setFieldValue(`showFlags.${flag}`, !isChecked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4F3DED] focus:ring-offset-2 ${isChecked ? 'bg-[#4F3DED]' : 'bg-gray-600'}`}>
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isChecked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    );
  };

  const handleMatchPredictionChange = (prediction) => {
    const currentPrediction = values.booleanOutcomes;
    const isCurrentlyHome = currentPrediction.homeWinBoolean;
    const isCurrentlyDraw = currentPrediction.drawBoolean;
    const isCurrentlyAway = currentPrediction.awayWinBoolean;

    if (prediction === 'home') {
      setFieldValue('booleanOutcomes.homeWinBoolean', true);
      setFieldValue('booleanOutcomes.drawBoolean', false);
      setFieldValue('booleanOutcomes.awayWinBoolean', false);
    } else if (prediction === 'draw') {
      setFieldValue('booleanOutcomes.homeWinBoolean', false);
      setFieldValue('booleanOutcomes.drawBoolean', true);
      setFieldValue('booleanOutcomes.awayWinBoolean', false);
    } else if (prediction === 'away') {
      setFieldValue('booleanOutcomes.homeWinBoolean', false);
      setFieldValue('booleanOutcomes.drawBoolean', false);
      setFieldValue('booleanOutcomes.awayWinBoolean', true);
    }
  };

  const handleGoalsPredictionChange = (prediction) => {
    const currentPrediction = values.booleanOutcomes;
    const isCurrentlyOver = currentPrediction.over25Boolean;
    const isCurrentlyUnder = currentPrediction.under25Boolean;

    if (prediction === 'over') {
      setFieldValue('booleanOutcomes.over25Boolean', true);
      setFieldValue('booleanOutcomes.under25Boolean', false);
    } else if (prediction === 'under') {
      setFieldValue('booleanOutcomes.over25Boolean', false);
      setFieldValue('booleanOutcomes.under25Boolean', true);
    }
  };

  const toggleBTTS = () => {
    setFieldValue('btts', !values.btts);
  };

  return (
    <Form className="space-y-6">
      {/* Match Prediction */}
      <div className="space-y-2 p-3 bg-[#1e1b3a] rounded-lg">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium text-gray-300">Match Prediction</h4>
          <ToggleSwitch flag="homeWinShow" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleMatchPredictionChange('home')}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${values.booleanOutcomes?.homeWinBoolean ? 'bg-[#4F3DED] text-white' : 'bg-[#323159] text-gray-300 hover:bg-[#3A3570]'}`}>
            1X
          </button>
          <button
            type="button"
            onClick={() => handleMatchPredictionChange('draw')}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${values.booleanOutcomes?.drawBoolean ? 'bg-[#4F3DED] text-white' : 'bg-[#323159] text-gray-300 hover:bg-[#3A3570]'}`}>
            X2
          </button>
          <button
            type="button"
            onClick={() => handleMatchPredictionChange('away')}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${values.booleanOutcomes?.awayWinBoolean ? 'bg-[#4F3DED] text-white' : 'bg-[#323159] text-gray-300 hover:bg-[#3A3570]'}`}>
            12
          </button>
        </div>
        {(() => {
          const home = Number(match?.prediction?.outcomes?.homeWin || 0);
          const draw = Number(match?.prediction?.outcomes?.draw || 0);
          const away = Number(match?.prediction?.outcomes?.awayWin || 0);
          const oneX = (home + draw).toFixed(2);
          const xTwo = (draw + away).toFixed(2);
          const oneTwo = (home + away).toFixed(2);
          return (
            <div className="text-xs text-gray-300 mt-2 flex justify-around">
              <span className="rounded-full bg-[#323159] px-2 py-1">1X: {oneX}%</span>
              <span className="rounded-full bg-[#323159] px-2 py-1">X2: {xTwo}%</span>
              <span className="rounded-full bg-[#323159] px-2 py-1">12: {oneTwo}%</span>
            </div>
          );
        })()}
      </div>

      {/* Goals Prediction */}
      <div className="space-y-2 p-3 bg-[#1e1b3a] rounded-lg">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium text-gray-300">Goals Prediction</h4>
          <ToggleSwitch flag="over25Show" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleGoalsPredictionChange('over')}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${values?.booleanOutcomes?.over25Boolean ? 'bg-[#4F3DED] text-white' : 'bg-[#323159] text-gray-300 hover:bg-[#3A3570]'}`}>
            Over 2.5
          </button>
          <button
            type="button"
            onClick={() => handleGoalsPredictionChange('under')}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${values.booleanOutcomes.under25Boolean ? 'bg-[#4F3DED] text-white' : 'bg-[#323159] text-gray-300 hover:bg-[#3A3570]'}`}>
            Under 2.5
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-2 flex justify-around">
          <span>Over 2.5: {match?.prediction?.outcomes?.over25?.toFixed(2) || 0}%</span>
          <span>Under 2.5: {(100 - (match?.prediction?.outcomes?.over25 || 0)).toFixed(2)}%</span>
        </div>
      </div>

      {/* BTTS */}
      <div className="space-y-2 p-3 bg-[#1e1b3a] rounded-lg">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-300">Both Teams To Score</h4>
          <ToggleSwitch flag="bttsShow" />
        </div>
        {/* <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Enable BTTS Prediction</span>
          <button
            type="button"
            onClick={toggleBTTS}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4F3DED] focus:ring-offset-2 ${values.btts ? 'bg-[#4F3DED]' : 'bg-gray-600'}`}>
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${values.btts ? 'translate-x-5' : 'translate-x-0'}`}/>
          </button>
        </div> */}
        <div className="text-xs text-gray-400 mt-2 text-center">
          <span>BTTS: {match?.prediction?.outcomes?.btts?.toFixed(2) || 0}%</span>
        </div>
      </div>

      {/* Corners */}
      <div className="space-y-2 p-3 bg-[#1e1b3a] rounded-lg">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium text-gray-300">Corners</h4>
          <ToggleSwitch flag="overCornersShow" />
        </div>
        <div className="relative">
          <input
            type="text"
            name="corners"
            value={values.corners || ''}
            onChange={(e) => {
              // Only allow numbers and one decimal point
              const value = e.target.value.replace(/[^0-9.]/g, '');
              // Only allow one decimal point
              const parts = value.split('.');
              if (parts.length <= 2) {
                setFieldValue('corners', value);
              }
            }}
            placeholder="e.g., 9.5"
            className="block w-full rounded-md border-0 bg-[#323159] py-2 px-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#4F3DED] sm:text-sm"
          />
          {values.corners && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-sm text-gray-400">corners</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-[#4F3DED] rounded-md hover:bg-[#3A2DB8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F3DED] disabled:opacity-50"
        >
          {isSubmitting || isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </Form>
  );
};

// Prediction Modal Component
const PredictionModal = ({ isOpen, onClose, match }) => {
  const [updatePrediction, { isLoading }] = useUpdatePredictionMutation();

  const calculateInitialValues = () => {
    const { booleanOutcomes, showFlags, manualCorners, outcomes } = match?.prediction || { showFlags: {}, booleanOutcomes: {}, outcomes: {} };
    console.log(match?.prediction, booleanOutcomes, 'match?.prediction');
    return {
      booleanOutcomes: {
        homeWinBoolean: outcomes?.homeWinBoolean ?? false,
        drawBoolean: outcomes?.drawBoolean ?? false,
        awayWinBoolean: outcomes?.awayWinBoolean ?? false,
        over25Boolean: outcomes?.over25Boolean ?? (outcomes?.over25 >= 55),
        under25Boolean: outcomes?.under25Boolean ?? (outcomes?.over25 < 55),
      },
      corners: manualCorners?.overCorners?.toString() || '',
      showFlags: {
        homeWinShow: showFlags?.homeWinShow ?? true,
        awayWinShow: showFlags?.awayWinShow ?? true,
        drawShow: showFlags?.drawShow ?? true,
        bttsShow: showFlags?.bttsShow ?? true,
        overCornersShow: showFlags?.overCornersShow ?? true,
        over25Show: showFlags?.over25Show ?? true,
      }
    };
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const data = {
        booleanOutcomes: values.booleanOutcomes,
        bttsShow: values.showFlags.bttsShow,
        overCornersShow: values.showFlags.overCornersShow,
        over25Show: values.showFlags.over25Show,
        homeWinShow: values.showFlags.homeWinShow,
        overCorners: parseFloat(values.corners) || 0,
      };

      await updatePrediction({ id: match?._id, data }).unwrap();

      toast.success('Prediction updated successfully', {
        duration: 3000,
        position: 'top-right',
      });

      onClose();
    } catch (error) {
      console.error('Error saving predictions:', error);
      toast.error(error?.data?.error || 'Failed to update prediction. Please try again.', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2A2550] rounded-lg w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <h3 className="text-xl font-semibold text-white mb-6">
          Edit Predictions for {match?.homeTeam?.name} vs {match?.awayTeam?.name}
        </h3>

        <Formik
          initialValues={calculateInitialValues()}
          validationSchema={predictionSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          <PredictionForm match={match} onClose={onClose} isLoading={isLoading} />
        </Formik>
      </div>
    </div>
  );
};

export default PredictionModal;


// Validation Schema
// import { Formik, Form, Field, useFormikContext } from 'formik';
// import * as Yup from 'yup';

// import { ChevronUp, ChevronDown, Edit, X } from "lucide-react";
// import { useUpdatePredictionMutation } from '../../../../services/Api';
// import { toast } from 'react-toastify';
// const predictionSchema = Yup.object().shape({
//   over15: Yup.number()
//     .min(0, 'Must be at least 0')
//     .max(100, 'Cannot be more than 100')
//     .nullable(),
//   homeWin: Yup.number()
//     .min(0, 'Must be at least 0')
//     .max(100, 'Cannot be more than 100')
//     .nullable(),
//   awayWin: Yup.number()
//     .min(0, 'Must be at least 0')
//     .max(100, 'Cannot be more than 100')
//     .nullable(),
//   draw: Yup.number()
//     .min(0, 'Must be at least 0')
//     .max(100, 'Cannot be more than 100')
//     .nullable(),
//   btts: Yup.number()
//     .min(0, 'Must be at least 0')
//     .max(100, 'Cannot be more than 100')
//     .nullable(),
//   corners: Yup.string()
//     .nullable(),
//   enabled: Yup.object().shape({
//     over15: Yup.boolean(),
//     homeWin: Yup.boolean(),
//     draw: Yup.boolean(),
//     awayWin: Yup.boolean(),
//     btts: Yup.boolean(),
//     corners: Yup.boolean()
//   })
// });

// const ToggleSwitch = ({ isOn, onToggle }) => {
//   return (
//     <button
//       type="button"
//       onClick={onToggle}
//       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${isOn ? 'bg-[#4F3DED]' : 'bg-[#323159]'}`}
//     >
//       <span
//         className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${isOn ? 'translate-x-6' : 'translate-x-1'}`}
//       />
//     </button>
//   );
// };

// // Toggle All Button Component
// const ToggleAllButton = () => {
//   const { values, setFieldValue } = useFormikContext();
//   const allEnabled = Object.values(values.enabled).every(Boolean);

//   const toggleAll = () => {
//     const newState = !allEnabled;
//     Object.keys(values.enabled).forEach(key => {
//       setFieldValue(`enabled.${key}`, newState);
//     });
//   };

//   return (
//     <div className="flex justify-between items-center mb-2">
//       <span className="text-sm font-medium text-gray-300">Enable/Disable Predictions</span>
//       <button
//         type="button"
//         onClick={toggleAll}
//         className="text-xs text-[#4F3DED] hover:underline"
//       >
//         {allEnabled ? 'Disable All' : 'Enable All'}
//       </button>
//     </div>
//   );
// };

// // Prediction Form Component
// const PredictionForm = ({ match, onClose, isLoading }) => {
//   const { values, setFieldValue, handleChange, handleSubmit, isSubmitting } = useFormikContext();

//   const togglePrediction = (field) => {
//     const currentValue = values.enabled[field];
//     setFieldValue(`enabled.${field}`, !currentValue);

//     // If enabling a field that has no value, set it to 0
//     if (currentValue === false && !values[field]) {
//       setFieldValue(field, 0);
//     }
//   };

//   return (
//     <Form className="space-y-4">
//       <ToggleAllButton />

//       {['over15', 'homeWin', 'awayWin', 'btts', 'draw', 'corners'].map((field) => (
//         <div key={field} className="bg-[#323159] p-3 rounded-lg">
//           <div className="flex items-center justify-between mb-2">
//             <label className="block text-sm font-medium text-gray-300">
//               {field === 'over15' ? 'Over 1.5 Goals' :
//                 field === 'homeWin' ? `${match?.homeTeam?.name} Wins` :
//                   field === 'awayWin' ? `${match?.awayTeam?.name} Wins` :
//                     field === 'btts' ? 'Both Teams To Score' :
//                       field === 'draw' ? 'Draw' : 'Corners'}
//             </label>
//             <ToggleSwitch
//               isOn={values.enabled[field]}
//               onToggle={() => togglePrediction(field)}
//             />
//           </div>
//           <Field
//             type={field === 'corners' ? 'text' : 'number'}
//             name={field}
//             min="0"
//             max="100"
//             step="0.01"
//             disabled={field === 'corners' ? false : true}
//             className={`w-full rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#4F3DED] ${values.enabled[field] ? 'bg-[#3A3570]' : 'bg-[#2A2540] text-gray-500 cursor-not-allowed'
//               }`}
//           />
//         </div>
//       ))}

//       <div className="flex justify-end space-x-3 pt-2">
//         <button
//           type="button"
//           onClick={onClose}
//           className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           disabled={isSubmitting || isLoading}
//           className="px-4 py-2 text-sm font-medium text-white bg-[#4F3DED] rounded-md hover:bg-[#3A2DB8] focus:outline-none focus:ring-2 focus:ring-[#4F3DED] disabled:opacity-50"
//         >
//           {isSubmitting || isLoading ? 'Saving...' : 'Save Changes'}
//         </button>
//       </div>
//     </Form>
//   );
// };

// // Prediction Modal Component
// const PredictionModal = ({ isOpen, onClose, match, }) => {
//   console.log(match, 'match');
//   const [updatePrediction, { isLoading }] = useUpdatePredictionMutation();
//   const initialValues = {
//     over15: match?.prediction?.outcomes?.over15?.toFixed(2) || '',
//     homeWin: match?.prediction?.outcomes?.homeWin?.toFixed(2) || '',
//     awayWin: match?.prediction?.outcomes?.awayWin?.toFixed(2) || '',
//     draw: match?.prediction?.outcomes?.draw?.toFixed(2) || '',
//     btts: match?.prediction?.outcomes?.btts?.toFixed(2) || '',
//     corners: match?.prediction?.manualCorners?.overCorners || '',
//     enabled: {
//       over15: match?.prediction?.showFlags?.over15Show,
//       homeWin: match?.prediction?.showFlags?.homeWinShow,
//       awayWin: match?.prediction?.showFlags?.awayWinShow,
//       draw: match?.prediction?.showFlags?.drawShow,
//       btts: match?.prediction?.showFlags?.bttsShow,
//       corners: match?.prediction?.showFlags?.overCornersShow
//     }
//   };
//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const data = {
//         outcomes: {
//           homeWin: parseFloat(values.homeWin) || 0,
//           awayWin: parseFloat(values.awayWin) || 0,
//           draw: parseFloat(values.draw) || 0,
//           over15: parseFloat(values.over15) || 0,
//           btts: parseFloat(values.btts) || 0,
//         },
//         manualCorners: {
//           overCorners: parseFloat(values.corners) || 0,
//         },
//         showFlags: {
//           over15Show: values.enabled.over15,
//           homeWinShow: values.enabled.homeWin,
//           awayWinShow: values.enabled.awayWin,
//           drawShow: values.enabled.draw,
//           bttsShow: values.enabled.btts,
//           overCornersShow: values.enabled.corners,
//         }
//       }
//       console.log(data, 'data');
//       await updatePrediction({ id: match?._id, data: data }).unwrap();
//       toast.success('Prediction updated successfully', {
//         duration: 3000,
//         position: 'top-right',
//       });
//       onClose();
//     } catch (error) {
//       console.error('Error saving predictions:', error);
//     } finally {
//       setSubmitting(false);
//       onClose();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-[#2A2550] rounded-lg w-full max-w-md p-6 relative max-h-[85vh] overflow-y-auto">
//         <button
//           type="button"
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-400 hover:text-white"
//         >
//           <X size={24} />
//         </button>

//         <h3 className="text-xl font-semibold text-white mb-6">
//           Edit Predictions for {match?.homeTeam?.name} vs {match?.awayTeam?.name}
//         </h3>

//         <Formik
//           initialValues={initialValues}
//           validationSchema={predictionSchema}
//           onSubmit={handleSubmit}
//           enableReinitialize
//         >
//           <PredictionForm match={match} onClose={onClose} isLoading={isLoading} />
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default PredictionModal;

