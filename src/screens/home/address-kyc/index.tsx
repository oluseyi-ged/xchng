import {
  Block,
  Button,
  Select,
  SizedBox,
  SvgIcon,
  Text,
  TextInput,
} from '@components';
import {HDP, SCREEN_WEIGHT, triggerToast} from '@helpers';
import {stateCities} from '@helpers/countriesList';
import DocumentPicker, {
  DocumentPickerResponse,
} from '@react-native-documents/picker';
import {palette} from '@theme';
import AWS, {Credentials} from 'aws-sdk';
import {decode} from 'base64-arraybuffer';
import {Formik} from 'formik';
import React, {FC, useEffect, useRef, useState} from 'react';
import fs from 'react-native-fs';
import {useUpdateProfileMutation} from 'services/mutationApi';
import {RootState, useAppSelector} from 'store';
import * as Yup from 'yup';
import styles from './styles';

const key = 'AKIA2FXADOW5OJDOLLI6';
const accessKey = 'V632q20CCwQT/AJNCuZtnxtJexTckR/HnvzVM6sh';
const PRIVATE_S3_BUCKET = 'xchngfx-bucket';

const uploadToPrivateS3 = async (filePath: string, directory: string) => {
  const access = new Credentials({
    accessKeyId: key,
    secretAccessKey: accessKey,
  });

  const privateS3 = new AWS.S3({
    credentials: access,
    region: 'us-east-1',
    signatureVersion: 'v4',
  });

  const fileExtension = filePath.split('.').pop();
  const fileName =
    Math.floor(Date.now() / 1000) +
    '-' +
    Math.floor(1000 + Math.random() * 9000);
  const contentType = `${fileName}.${fileExtension}`;
  let s3FileName = `${directory}/${contentType}`;

  const urlParams = {
    Bucket: PRIVATE_S3_BUCKET,
    Key: s3FileName,
    Expires: 60 * 15,
    ACL: 'bucket-owner-full-control',
    ContentType: 'image/jpeg',
  };

  const signedUrl = privateS3.getSignedUrl('putObject', urlParams);

  const base64 = await fs.readFile(filePath, 'base64');
  const arrayBuffer = decode(base64);

  try {
    await fetch(signedUrl, {
      method: 'PUT',
      body: arrayBuffer,
      headers: {
        'Content-Type': 'image/jpeg',
        'x-amz-acl': 'bucket-owner-full-control',
      },
    });

    const getUrlParams = {
      Bucket: PRIVATE_S3_BUCKET,
      Key: s3FileName,
      Expires: 60 * 60 * 24 * 7, // 1 week expiration for the URL
    };

    const imageUrl = privateS3.getSignedUrl('getObject', getUrlParams);
    return imageUrl;
  } catch (e: any) {
    throw e;
  }
};

const AddressSchema = Yup.object().shape({
  address: Yup.string().required('Address is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  zipCode: Yup.string().required('Zip code is required'),
});

interface AddressKycProps {
  navigation: any;
}

export const AddressKyc: FC<AddressKycProps> = ({navigation}) => {
  const formikRef = useRef<any>(null);
  const [currentCity, setCurrentCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [userValues, setUserValues] = useState<any>({});
  const [isValid, setIsValid] = useState(false);
  const [file, setFile] = useState<DocumentPickerResponse | null>(null);
  const [uploadUrls, setUploadUrls] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const {auth: userData} = useAppSelector((store: RootState) => store.auth);

  console.log(uploadUrls, 'markup');

  const [
    updateProfile,
    {
      isLoading: updateLoad,
      isError: updateIsErr,
      error: updateError,
      isSuccess: updateTrue,
    },
  ] = useUpdateProfileMutation();

  const stateOptions = stateCities.map(state => ({
    name: state.name,
    value: state.name,
  }));

  const getCitiesForState = (stateName: string) => {
    const selectedState = stateCities.find(state => state.name === stateName);
    return selectedState
      ? selectedState.cities.map(city => ({
          name: city,
          value: city,
        }))
      : [];
  };

  const handleFilePick = async () => {
    try {
      const fileDetails = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        copyTo: 'cachesDirectory',
      });

      if (fileDetails.length > 0) {
        const fileDetail = fileDetails[0];
        setFile(fileDetail);
        setIsUploading(true);

        try {
          const filePath = fileDetail.uri;
          const imageUrl = await uploadToPrivateS3(filePath, 'utility-bills');
          setUploadUrls(prev => ({
            ...prev,
            utilityBill: imageUrl,
          }));
          triggerToast('File uploaded successfully', 'success');
        } catch (uploadError) {
          console.error('Error uploading file:', uploadError);
          triggerToast('Error uploading file', 'error');
        } finally {
          setIsUploading(false);
        }
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('Error picking document:', error);
        triggerToast('Error selecting file', 'error');
      }
    }
  };

  useEffect(() => {
    if (updateTrue) {
      triggerToast(
        'Go ahead and complete your Liveness verification.',
        'success',
        'Success',
      );
      navigation.goBack();
    }
    if (updateIsErr && updateError && 'data' in updateError) {
      triggerToast(updateError.data?.message, 'error', 'Error');
    }
  }, [updateTrue, updateIsErr, updateError, navigation]);

  const handleSubmit = async (values: any) => {
    try {
      const updatedUserValues = {
        ...values,
        utilityBill: uploadUrls.utilityBill,
      };
      await updateProfile(updatedUserValues).unwrap();
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  const initialValues = {
    address: '',
    state: '',
    city: '',
    zipCode: '',
  };

  return (
    <Block bg="#05081A" safe flex={1} style={styles.pageWrap}>
      {/* Header */}
      <Block
        style={styles.pageHeader}
        row
        justify="space-between"
        align="center">
        <SvgIcon name="back" size={40} onPress={() => navigation.goBack()} />
        <Block>
          <Text center size={16} color={palette.white}>
            Address Information
          </Text>
          <Text medium center size={10} color={palette.white}>
            Step 1 of 1
          </Text>
        </Block>
        <SizedBox width={40} />
      </Block>

      {/* Content */}
      <Block scrollIn bg={'#FAFAFF'} style={styles.formBox}>
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={AddressSchema}
          onSubmit={handleSubmit}
          validateOnMount>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValid: formikIsValid,
          }) => {
            useEffect(() => {
              setUserValues(values);
              setIsValid(formikIsValid && !!uploadUrls.utilityBill);
            }, [values, formikIsValid, uploadUrls.utilityBill]);

            return (
              <Block>
                <Block>
                  <Text medium size={24} color="#05081A">
                    Address Information
                  </Text>
                  <Text size={14} color="#05081A">
                    Provide your address details to proceed.
                  </Text>
                </Block>
                <SizedBox height={20} />

                <TextInput
                  label="Address *"
                  value={values.address}
                  onChangeText={handleChange('address')}
                  onBlur={handleBlur('address')}
                  error={touched.address && errors.address}
                  placeholder="549 ajose street ligali"
                />

                <SizedBox height={16} />
                <Select
                  label="State *"
                  placeholder="Select state"
                  data={stateOptions}
                  onSelect={(item: any) => {
                    handleChange('state')(item.value);
                    setStateName(item.value);
                    setCurrentCity('');
                    handleChange('city')('');
                  }}
                  value={values.state}
                  error={
                    touched.state && errors.state ? errors.state : undefined
                  }
                />

                <SizedBox height={16} />
                <Select
                  label="City *"
                  placeholder="Select city"
                  data={stateName ? getCitiesForState(stateName) : []}
                  onSelect={(item: any) => handleChange('city')(item.value)}
                  value={values.city}
                  error={touched.city && errors.city ? errors.city : undefined}
                />

                <SizedBox height={16} />
                <TextInput
                  label="Zip code *"
                  value={values.zipCode}
                  onChangeText={handleChange('zipCode')}
                  onBlur={handleBlur('zipCode')}
                  error={touched.zipCode && errors.zipCode}
                  keyboardType="numeric"
                  placeholder="10011"
                />

                <SizedBox height={16} />
                <Text style={styles.label}>Upload Utility Bill</Text>

                {file ? (
                  <Block
                    style={styles.fileContainer}
                    bg="#EEFFF7"
                    row
                    flex={1}
                    justify="space-between"
                    align="center">
                    <Block flex={0.7} row align="center" gap={16}>
                      <SvgIcon name="doc" size={32} />
                      <Block flex={1}>
                        <Text>{file?.name}</Text>
                        <Text>{(file?.size / 1024).toFixed(2)} kb</Text>
                        {isUploading && <Text>Uploading...</Text>}
                      </Block>
                    </Block>
                    <Block flex={0.1}>
                      <SvgIcon
                        name="delete"
                        size={32}
                        onPress={() => {
                          setFile(null);
                          setUploadUrls(prev => ({
                            ...prev,
                            utilityBill: '',
                          }));
                        }}
                      />
                    </Block>
                  </Block>
                ) : (
                  <Block
                    alignItems="center"
                    radius={6}
                    style={styles.uploadContainer}
                    onPress={handleFilePick}
                    disabled={isUploading}>
                    <Text center>Upload file</Text>
                    <SvgIcon name="upload" size={24} />
                  </Block>
                )}

                <SizedBox height={HDP(100)} />
              </Block>
            );
          }}
        </Formik>
      </Block>

      <Block
        bg="#FAFAFF"
        position="absolute"
        bottom={0}
        style={{paddingHorizontal: HDP(24), paddingVertical: HDP(20)}}
        width={SCREEN_WEIGHT}
        alignSelf="center">
        <Button
          title="Submit"
          onPress={() => formikRef.current?.submitForm()}
          disabled={!isValid || updateLoad || isUploading}
          loading={updateLoad || isUploading}
        />
      </Block>
    </Block>
  );
};
