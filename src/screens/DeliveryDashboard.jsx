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

import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  TouchableWithoutFeedback,
  NativeModules,
  NativeEventEmitter,
  Image,
} from 'react-native';
import {Colors, Fonts} from '@utils/Constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import DeliveryHeader from '@components/delivery/DeliveryHeader';
import CustomText from '@components/ui/CustomText';
import Booking from '../components/delivery/Booking';
import {
  deleteAllBookings,
  fetchOrders,
  insertOrder,
  updateBidConfig,
} from 'database/dbOperations';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectRider,
  selectRiderDetails,
  selectToken,
} from '../redux/slices/riderSlice';
import CustomBanner from '@components/ui/CustomBanner';
import {navigate} from '@navigation/NavigationService';
import PermissionModal from '@components/ui/PermissionModal';
import withLiveBooking from '@components/delivery/withLiveBooking';
import BottomModal from '@components/ui/BottomModal';
import {
  selectIsDeliveryOnProcess,
  selectIsGpsEnabled,
  selectIsModalVisible,
  selectIsOnline,
  setIsDeliveryOnProcess,
} from 'redux/slices/modalSlice';
import BottomModalInfo from '@components/ui/BottomModalInfo';
import {
  clearBidChanges,
  clearBookingList,
  clearNewBookings,
  selectBidChanges,
  selectBookingList,
  selectNewBookings,
  setCurrentBooking,
} from 'redux/slices/bookingSlice';
import StartingDutyModal from '@components/delivery/StartingDutyModal';
import {RMS, RS, RV} from '@utils/responsive';
import deliveryboy from '../assets/images/delivery_boy.png';
import {getGreeting} from '@utils/greetings';
import {useTranslation} from 'react-i18next';
import {FetchRiderKyc} from 'redux/actions/riderAction';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const LodingIndicator = () => {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={Colors.secondary} size="large" />
      <CustomText style={styles.emptyText}>Searching for bookings!</CustomText>
    </View>
  );
};

const DeliveryDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const bottomSheetRef = useRef(null);
  const rider = useSelector(selectRider);
  const bookingList = useSelector(selectBookingList);
  const newBookings = useSelector(selectNewBookings);
  const bidChanges = useSelector(selectBidChanges);
  const dispatch = useDispatch();
  const isOnline = useSelector(selectIsOnline);

  const isModalVisible = useSelector(selectIsModalVisible);
  const isGpsEnabled = useSelector(selectIsGpsEnabled);
  const isDeliveryOnProcess = useSelector(selectIsDeliveryOnProcess);
  const kyc_approved = true;
  const {t} = useTranslation();

  const st = useSelector(selectToken);
  const riderDetails = useSelector(selectRiderDetails);
  const [imageUri, setImageUri] = useState({user_photo: ''});
  const [files, setFiles] = useState({user_photo: null});
  const [dataLoaded, setDataLoaded] = useState(false);

  const {SendModule} = NativeModules;
  const sendModuleEmitter = new NativeEventEmitter(SendModule);

  useEffect(() => {
    const subscription = sendModuleEmitter.addListener(
      'EventReminder',
      event => {
        console.log(event.latitude, event.longitude, 'DATA');
      },
    );

    SendModule.triggerEvent();

    return () => {
      subscription.remove();
    };
  }, []);

  const fetchAndNormalizeOrders = async () => {
    const orders = await fetchOrders();
    // setLoading(true);

    let createdAt = orders.created_at;

    // If it's a timestamp (number), convert it to a Date object
    if (typeof createdAt === 'number' || !isNaN(Date.parse(createdAt))) {
      createdAt = new Date(createdAt);
    } else {
      createdAt = new Date(Date.parse(createdAt));
    }

    // Now safely convert the Date object to an ISO string
    const isoCreatedAt =
      createdAt instanceof Date && !isNaN(createdAt)
        ? createdAt.toISOString()
        : null;

    // Normalize the orders
    const normalizedOrders = orders.map(order => ({
      bid: order.bid,
      bidConfig: JSON.parse(order.bidConfig),
      created_at: isoCreatedAt,
      drops: JSON.parse(order.drops),
      orderId: order.orderId,
      pickup: JSON.parse(order.pickup),
      status: order.status,
      trip_distance: order.trip_distance,
    }));
    setBookings(normalizedOrders);
    dispatch(setCurrentBooking(normalizedOrders));
    setLoading(false);
    // setRefreshing(false);

    // console.log(normalizedOrders, 'Normalized Orders');
  };

  //fetchcing bookings from db(sqlite)
  useEffect(() => {
    if (isOnline) {
      deleteAllBookings();
      fetchAndNormalizeOrders();
    }
  }, [isOnline]);

  const insertBooking = async booking => {
    try {
      await insertOrder({
        bid: booking?.bid,
        pickup: JSON.stringify({
          address1: booking?.pickup_address1,
          address2: booking?.pickup_address2,
          city: booking?.pickup_city,
          district: booking?.pickup_district,
          state: booking?.pickup_state,
          zip: booking?.pickup_zip,
          mobile: booking?.pickup_mobile,
          name: booking?.pickup_name,
          geo: booking?.pickup_geo,
          house: booking?.pickup_house,
          landmark: booking?.pickup_landmark,
        }),
        drops: JSON.stringify({
          address1: booking?.drop_address1,
          address2: booking?.drop_address2,
          city: booking?.drop_city,
          district: booking?.drop_district,
          state: booking?.drop_state,
          geo: booking?.drop_geo,
          zip: booking?.drop_zip,
          mobile: booking?.drop_mobile,
          landmark: booking?.drop_landmark,
          name: booking?.drop_name,
          house: booking?.drop_house,
        }),
        trip_distance: booking?.trip_distance,
        trip_time: booking?.trip_time,
        status: booking?.status,
        bidConfig: JSON.stringify(booking?.bidConfig), // Adjust if needed
      });
      console.log('Booking inserted successfully!');
      return true; // Indicate success
    } catch (error) {
      console.error('Error inserting booking:', error);
      return false; // Indicate failure
    }
  };

  //insert booking in db/sqlite
  useEffect(() => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000;

    const newBookingWithRetry = async (retryCount = 0) => {
      if (!newBookings) return;

      console.log('CALLED_NEW_BOOKING', newBookings);

      const success = await insertBooking(newBookings);
      dispatch(clearNewBookings());

      if (success) {
        console.log('Booking inserted successfully!');
        await fetchAndNormalizeOrders();
      } else {
        console.error('Booking insertion failed.');

        // Retry if max retries not reached
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying... Attempt ${retryCount + 1}`);
          setTimeout(() => {
            newBookingWithRetry(retryCount + 1); // Retry with incremented count
          }, RETRY_DELAY);
        } else {
          console.error('Max retries reached. Insertion failed.');
        }
      }
    };

    if (newBookings && Object.keys(newBookings).length > 0) {
      newBookingWithRetry(); // Start the insertion with retry logic
    }
  }, [newBookings, isOnline]);

  const insertAllBookings = async () => {
    const results = []; // Track insertion results
    for (const booking of bookingList) {
      console.log('CALLED_INSERT_ALL_BOOKINGS');

      const success = await insertBooking(booking);
      results.push(success);
    }
    // Check if all insertions were successful
    const allInserted = results.every(result => result);
    if (allInserted) {
      console.log('All bookings inserted successfully!');
    } else {
      console.log('Some bookings failed to insert.');
      throw new Error('Not all bookings were inserted.'); // Trigger retry
    }
  };

  //insert all bookings in db/sqlite
  useEffect(() => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000;

    const syncBookingsWithRetry = async (retryCount = 0) => {
      try {
        console.log('Attempting to sync bookings...');

        // Step 1: Clear existing bookings
        await deleteAllBookings();
        console.log('Deleted all previous bookings.');

        // Step 2: Insert new bookings
        await insertAllBookings();
        console.log('Inserted all bookings successfully.');

        // Step 3: Fetch and normalize orders
        await fetchAndNormalizeOrders();

        // Step 4: Clear booking list from state
        dispatch(clearBookingList());

        console.log('Sync process completed successfully!');
      } catch (error) {
        console.error(`Error syncing bookings: ${error.message}`);

        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying... Attempt ${retryCount + 1}`);
          setTimeout(() => {
            syncBookingsWithRetry(retryCount + 1);
          }, RETRY_DELAY);
        } else {
          console.error('Max retries reached. Sync failed.');
        }
      }
    };

    if (bookingList.length > 0 && isOnline) {
      console.log('CALLED AGAIN BOOKING LIST');
      syncBookingsWithRetry(); // Start the sync process with retry
    }
  }, [bookingList, isOnline]);

  const openBottomSheet = () => {
    bottomSheetRef.current?.scrollTo(-SCREEN_HEIGHT / 3);
  };

  //update booking bid in db/sqlite
  useEffect(() => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000;

    const updateBookingBid = async (retryCount = 0) => {
      if (bidChanges) {
        try {
          const response = await updateBidConfig(
            bidChanges?.bid,
            JSON.stringify(bidChanges),
          );
          dispatch(clearBidChanges());
          fetchAndNormalizeOrders();
          console.log('BookingBid Updated Successfully', response);
        } catch (error) {
          console.log('Error updating bookin bid:', error);

          if (retryCount < MAX_RETRIES) {
            console.log(`Retrying... Attempt ${retryCount + 1}`);
            setTimeout(() => {
              updateBookingBid(retryCount + 1);
            }, RETRY_DELAY);
          } else {
            console.log('MAx retries reached. Update failed');
          }
        }
      }
    };
    if (isOnline && bidChanges && Object.keys(bidChanges).length > 0) {
      updateBookingBid();
    }
  }, [bidChanges, isOnline]);

  //If not a ONLINE delete all bookings from the db/sqlite
  useEffect(() => {
    const deleteBookings = async () => {
      const response = await deleteAllBookings();
      setBookings([]);
      dispatch(clearBookingList());
    };
    if (!isOnline) {
      deleteBookings();
    }
  }, [isOnline]);

  //list of available  bookings
  const renderBookings = ({item, index}) => {
    return (
      <Booking
        index={index}
        booking={item}
        isOnline={isOnline}
        isKycApproved={kyc_approved}
      />
    );
  };

  const onBoardingHandlePress = () => {
    navigate('OnboardingStack');
  };

  const manageProfileHandlePress = () => {
    navigate('Profile');
  };

  const fetchKycData = async () => {
    if (st && !riderDetails) {
      try {
        const response = await dispatch(FetchRiderKyc(st));
        console.log(response, 'RESPONSE_DISPATCH');
        if (response?.status === 200) {
          setImageUri(response.data.photo || '');
          setFiles(prevValues => ({
            ...prevValues,
            user_photo: response.data.photo || '',
          }));
          setDataLoaded(true);
          console.log('KYC data fetched successfully:', response.data);
        } else {
          console.log('Error in fetching KYC:', response);
        }
      } catch (error) {
        console.log('Error in fetchKycData:', error);
      }
    }
  };

  //fetch kyc data
  useEffect(() => {
    fetchKycData();
  }, [st]);

  return (
    <TouchableWithoutFeedback onPress={openBottomSheet}>
      <View style={styles.container}>
        <SafeAreaView>
          <DeliveryHeader
            kycApproved={rider?.kyc_approved}
            isOnline={isOnline}
          />
        </SafeAreaView>
        {!isOnline && (
          <View style={styles.info}>
            <CustomText
              style={{color: '#fff'}}
              variant="h3"
              fontFamily={Fonts.light}>
              {getGreeting(t)}! {rider?.first_name}
              {rider?.last_name}
            </CustomText>
            <CustomText
              style={{color: '#fff'}}
              variant="h4"
              fontFamily={Fonts.light}>
              {t('GO_ONLINE_TO_RECEIVE_BOOKINGS')}
            </CustomText>
            <Image source={deliveryboy} style={styles.image} />
          </View>
        )}
        <View style={styles.subContainer}>
          <FlatList
            data={bookings}
            ListEmptyComponent={!loading && isOnline && <LodingIndicator />}
            renderItem={renderBookings}
            keyExtractor={booking => booking?.bid}
            contentContainerStyle={styles.flatlistContainer}
            ListHeaderComponent={
              rider?.kyc_approved && (
                <>
                  {rider?.kyc_error_message && (
                    <CustomBanner
                      isbuttonVisible={true}
                      titleColor="red"
                      textColor="#410002"
                      buttonColor="#5E1914"
                      backgroundColor="#FCEBEB"
                      title="Verification failed! Please complete pending steps"
                      message={
                        rider?.kyc_error_message || t('KYC_NOT_APPROVED')
                      }
                      onButtonPress={manageProfileHandlePress}
                      buttonText={t('CONTINUE')}
                    />
                  )}
                  {/* have to add condition : !rider?.kyc_approved */}
                  {/* {rider?.kyc_approved === 'incomplete' && ( */}
                  {rider?.kyc_approved === 'approved' && (
                    <CustomBanner
                      titleColor="black"
                      isbuttonVisible={true}
                      title={t('COMPLETE_ONBOARDING_PROCESS')}
                      onButtonPress={onBoardingHandlePress}
                      screen="OnboardingDetails"
                      buttonText={t('CONTINUE')}
                    />
                  )}
                  {rider?.kyc_approved === 'pending' && (
                    <CustomBanner
                      isbuttonVisible={false}
                      title={t('KYC approval is pending.')}
                      onButtonPress={onBoardingHandlePress}
                      buttonText={t('CONTINUE')}
                    />
                  )}
                </>
              )
            }
          />
        </View>

        <PermissionModal
          message={t('Please select Allow all the time')}
          title={t(
            'Please grant Location permissions to start using this app.',
          )}
          visible={isModalVisible}
        />
        <BottomModal modalVisible={isGpsEnabled} />
        <BottomModalInfo
          title={t("Can't go offline while Delivery in process.")}
          modalVisible={isDeliveryOnProcess}
          onClose={() => dispatch(setIsDeliveryOnProcess(false))}
        />
        {/* <EmergencyHelp /> */}
        <StartingDutyModal />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  subContainer: {
    backgroundColor: Colors.backgroundSecondary,
    flex: 1,
    padding: RMS(6),
  },
  flatlistContainer: {
    padding: RMS(2),
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: Fonts.light,
    color: Colors.text,
  },
  bottomSheetContent: {
    padding: RMS(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    borderWidth: 1,
    height: RV(100),
    borderColor: Colors.border,
    margin: RMS(5),
    borderRadius: RMS(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000C66',
  },
  image: {
    height: RV(40),
    width: RS(30),
  },
});

export default withLiveBooking(DeliveryDashboard);
