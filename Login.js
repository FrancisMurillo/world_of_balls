import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { NavigationActions } from "react-navigation";
import { TextField as BaseTextField } from "react-native-material-textfield";
import {
  TriangleColorPicker as BaseColorPicker,
  fromHsv
} from "react-native-color-picker";
import styled from "styled-components/native";
import { reduxForm, Field } from "redux-form";

import { updateProfile, connect } from "./Reducer";
import { joinRoom } from "./Action";

const TextField = styled(BaseTextField).attrs({
  fontSize: 16,
  labelFontSize: 14,
  lineWidth: 0.7,
  labelTextStyle: ({ theme }) => ({
    color: theme.primaryColor,
    fontWeight: "bold"
  }),
  baseColor: ({ theme }) => theme.textColor,
  textColor: ({ theme }) => theme.textColor,
  tintColor: ({ theme }) => theme.primaryColor,
  errorColor: ({ theme }) => theme.errorTextColor
})``;

const FormInput = ({ input, meta: { touched, error }, ...inputProps }) => (
  <TextField {...input} {...inputProps} error={touched && error ? error : ""} />
);

const ColorPicker = styled(BaseColorPicker)`
  flex: 1;
`;

const FormColorPickerWrapper = styled.View`
  flex: 1;
`;

const FormColorPickerLabel = styled.Text`
  fontsize: 16;
`;

const FormColorPicker = ({
  label,
  input,
  meta: { touched, error },
  ...inputProps
}) => (
  <FormColorPickerWrapper>
    <FormColorPickerLabel>{label}</FormColorPickerLabel>
    <ColorPicker
      onColorSelected={input.onChange}
      onColorChange={input.onChange}
      color={input.value}
    />
    <FormError>{touched && error ? error : ""}</FormError>
  </FormColorPickerWrapper>
);
const SubmitSpinner = styled.ActivityIndicator.attrs({ size: 25 })``;

const SubmitButtonText = styled.Text`
  textalign: center;
  fontsize: 22;
  fontweight: bold;
  color: ${props => props.theme.primaryBackgroundColor};
`;

const SubmitButtonWrapper = styled.View`
  justifycontent: center;
  alignitems: center;
  paddingvertical: 16;
  backgroundcolor: ${props =>
    props.theme[props.backgroundColor || "primaryColor"]};
`;

export const SubmitButton = ({
  handleSubmit,
  onPress,
  submitting,
  label,
  backgroundColor
}) => {
  const innerComponent = submitting ? (
    <SubmitSpinner />
  ) : (
    <SubmitButtonText>{label}</SubmitButtonText>
  );

  return (
    <TouchableOpacity onPress={submitting ? null : handleSubmit || onPress}>
      <SubmitButtonWrapper backgroundColor={backgroundColor}>
        {innerComponent}
      </SubmitButtonWrapper>
    </TouchableOpacity>
  );
};

const Screen = styled.View`
  width: 100%;
  height: 100%;
  paddinghorizontal: 16px;
  paddingvertical: 16px;
`;

export const FormError = styled.Text`
  paddingvertical: 10;
  textalign: center;
  fontsize: 15;
  fontweight: bold;
  color: ${props => props.theme.errorTextColor};
`;

const required = value => (value ? null : "Error: Required");

const FormScreen = ({ handleSubmit, submitting, error }) => (
  <Screen>
    <Field
      name={"name"}
      label={"Client Name"}
      component={FormInput}
      validate={[required]}
    />
    <Field
      name={"color"}
      label={"Color"}
      component={FormColorPicker}
      validate={[required]}
    />
    <FormError>{error || ""}</FormError>
    <SubmitButton
      handleSubmit={handleSubmit}
      submitting={submitting}
      label={"JOIN"}
    />
  </Screen>
);

const formKey = "login";

export default reduxForm({
  form: formKey,
  onSubmit: (values, _dispatch, _props) => Promise.resolve(values),
  onSubmitSuccess: (result, dispatch, _props) => {
    dispatch(
      joinRoom({
        name: result.name,
        color: fromHsv(result.color),
        size: Math.floor(Math.random() * 100) + 20
      })
    );
    dispatch(connect());

    dispatch(
      NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: "Room",
            params: {}
          })
        ]
      })
    );
  },
  initialValues: {
    name: "FnMurillo",
    color: "#123456"
  }
})(FormScreen);
