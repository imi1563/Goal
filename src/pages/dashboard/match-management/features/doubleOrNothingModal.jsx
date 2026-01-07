// Validation Schema
import { Formik, Form, Field, useFormikContext } from 'formik';
import * as Yup from 'yup';

import { ChevronUp, ChevronDown, Edit, X } from "lucide-react";
import { useUpdateDoubleOrNothingMatchesMutation, useUpdatePredictionMutation } from '../../../../services/Api';
import { toast } from 'react-toastify';
const predictionSchema = Yup.object().shape({
    over15: Yup.number()
        .min(0, 'Must be at least 0')
        .max(100, 'Cannot be more than 100')
        .nullable(),
    homeWin: Yup.number()
        .min(0, 'Must be at least 0')
        .max(100, 'Cannot be more than 100')
        .nullable(),
    awayWin: Yup.number()
        .min(0, 'Must be at least 0')
        .max(100, 'Cannot be more than 100')
        .nullable(),
    draw: Yup.number()
        .min(0, 'Must be at least 0')
        .max(100, 'Cannot be more than 100')
        .nullable(),
    btts: Yup.number()
        .min(0, 'Must be at least 0')
        .max(100, 'Cannot be more than 100')
        .nullable(),
    corners: Yup.string()
        .nullable(),
    enabled: Yup.object().shape({
        over15: Yup.boolean(),
        homeWin: Yup.boolean(),
        draw: Yup.boolean(),
        awayWin: Yup.boolean(),
        btts: Yup.boolean(),
        corners: Yup.boolean()
    })
});

const ToggleSwitch = ({ isOn, onToggle }) => {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${isOn ? 'bg-[#4F3DED]' : 'bg-[#323159]'}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${isOn ? 'translate-x-6' : 'translate-x-1'}`}
            />
        </button>
    );
};

// Toggle All Button Component
const ToggleAllButton = () => {
    const { values, setFieldValue } = useFormikContext();
    const allEnabled = Object.values(values.enabled).every(Boolean);

    const toggleAll = () => {
        const newState = !allEnabled;
        Object.keys(values.enabled).forEach(key => {
            setFieldValue(`enabled.${key}`, newState);
        });
    };

    return (
        <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-300">Enable/Disable Predictions</span>
            <button
                type="button"
                onClick={toggleAll}
                className="text-xs text-[#4F3DED] hover:underline"
            >
                {allEnabled ? 'Disable All' : 'Enable All'}
            </button>
        </div>
    );
};

// Prediction Form Component
const PredictionForm = ({ match, onClose, isLoading }) => {
    const { values, setFieldValue, handleChange, handleSubmit, isSubmitting } = useFormikContext();

    const togglePrediction = (field) => {
        const currentValue = values.enabled[field];
        setFieldValue(`enabled.${field}`, !currentValue);

        // If enabling a field that has no value, set it to 0
        if (currentValue === false && !values[field]) {
            setFieldValue(field, 0);
        }
    };

    return (
        <Form className="space-y-4">
            <ToggleAllButton />

            {['over15', 'homeWin', 'awayWin', 'btts', 'draw', 'corners'].map((field) => (
                <div key={field} className="bg-[#323159] p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-300">
                            {field === 'over15' ? 'Over 1.5 Goals' :
                                field === 'homeWin' ? `${match?.homeTeam?.name} Wins` :
                                    field === 'awayWin' ? `${match?.awayTeam?.name} Wins` :
                                        field === 'btts' ? 'Both Teams To Score' :
                                            field === 'draw' ? 'Draw' : 'Corners'}
                        </label>
                        <ToggleSwitch
                            isOn={values.enabled[field]}
                            onToggle={() => togglePrediction(field)}
                        />
                    </div>
                    <Field
                        type={field === 'corners' ? 'text' : 'number'}
                        name={field}
                        min="0"
                        max="100"
                        step="0.01"
                        disabled={!values.enabled[field]}
                        className={`w-full rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#4F3DED] ${values.enabled[field] ? 'bg-[#3A3570]' : 'bg-[#2A2540] text-gray-500 cursor-not-allowed'
                            }`}
                    />
                </div>
            ))}

            <div className="flex justify-end space-x-3 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#4F3DED] rounded-md hover:bg-[#3A2DB8] focus:outline-none focus:ring-2 focus:ring-[#4F3DED] disabled:opacity-50"
                >
                    {isSubmitting || isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </Form>
    );
};

// Prediction Modal Component
const DoubleOrNothingModal = ({ isOpen, onClose, match, setDoubleOrNothingLoading }) => {
    console.log(match, 'match double or nothing');
    const [updatePrediction, { isLoading }] = useUpdatePredictionMutation();
    const [updateDoubleOrNothingMatches] = useUpdateDoubleOrNothingMatchesMutation()
    const initialValues = {
        over15: match?.prediction?.outcomes?.over15?.toFixed(2) || '',
        homeWin: match?.prediction?.outcomes?.homeWin?.toFixed(2) || '',
        awayWin: match?.prediction?.outcomes?.awayWin?.toFixed(2) || '',
        draw: match?.prediction?.outcomes?.draw?.toFixed(2) || '',
        btts: match?.prediction?.outcomes?.btts?.toFixed(2) || '',
        corners: match?.prediction?.manualCorners?.overCorners || '',
        enabled: {
            over15: match?.prediction?.showFlags?.over15Show,
            homeWin: match?.prediction?.showFlags?.homeWinShow,
            awayWin: match?.prediction?.showFlags?.awayWinShow,
            draw: match?.prediction?.showFlags?.drawShow,
            btts: match?.prediction?.showFlags?.bttsShow,
            corners: match?.prediction?.showFlags?.overCornersShow
        }
    };
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const data = {
                outcomes: {
                    homeWin: parseFloat(values.homeWin) || 0,
                    awayWin: parseFloat(values.awayWin) || 0,
                    draw: parseFloat(values.draw) || 0,
                    over15: parseFloat(values.over15) || 0,
                    btts: parseFloat(values.btts) || 0,
                },
                manualCorners: {
                    overCorners: parseFloat(values.corners) || 0,
                },
                showFlags: {
                    over15Show: values.enabled.over15,
                    homeWinShow: values.enabled.homeWin,
                    awayWinShow: values.enabled.awayWin,
                    drawShow: values.enabled.draw,
                    bttsShow: values.enabled.btts,
                    overCornersShow: values.enabled.corners,
                }
            }
            console.log(data, 'data');
            await updatePrediction({ id: match?._id, data: data }).unwrap();
            // toast.success('Prediction updated successfully', {
            //     duration: 3000,
            //     position: 'top-right',
            // });
            try {
                setDoubleOrNothingLoading(match?._id);
                const data = {
                    doubleOrNothing: !match?.doubleOrNothing
                };
                await updateDoubleOrNothingMatches({ id: match?._id, data }).unwrap();
                toast.success(`Match ${!match?.doubleOrNothing ? 'Enabled Double or Nothing' : 'Disabled Double or Nothing'} successfully`, {
                    duration: 3000,
                    position: 'top-right',
                });
                onClose();
            } catch (error) {
                toast.error(error?.data?.error || 'Failed to update match status', {
                    duration: 3000,
                    position: 'top-right',
                });
            } finally {
                setDoubleOrNothingLoading(null);
            }
        } catch (error) {
            console.error('Error saving predictions:', error);
        } finally {
            setSubmitting(false);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#2A2550] rounded-lg w-full max-w-md p-6 relative max-h-[85vh] overflow-y-auto">
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
                    initialValues={initialValues}
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

export default DoubleOrNothingModal;
