#include <Crypto.h>
#include <Ed25519.h>
#include <Arduino.h>
#include <LoRaWan-RAK4630.h>
#include <SPI.h>


// RAK4630 supply two LED
#ifndef LED_BUILTIN
#define LED_BUILTIN 35
#endif

#ifndef LED_BUILTIN2
#define LED_BUILTIN2 36
#endif


#define PHOTO_TRANSISTOR_PIN A0

bool doOTAA = true;   // OTAA is used by default.
#define SCHED_MAX_EVENT_DATA_SIZE APP_TIMER_SCHED_EVENT_DATA_SIZE /**< Maximum size of scheduler events. */
#define SCHED_QUEUE_SIZE 60										  /**< Maximum number of events in the scheduler queue. */
#define LORAWAN_DATERATE DR_4									  /*LoRaMac datarates definition, from DR_0 to DR_5*/
#define LORAWAN_TX_POWER TX_POWER_5							/*LoRaMac tx power definition, from TX_POWER_0 to TX_POWER_15*/
#define JOINREQ_NBTRIALS 5										  /**< Number of trials for the join request. */
DeviceClass_t g_CurrentClass = CLASS_A;					/* class definition*/
LoRaMacRegion_t g_CurrentRegion = LORAMAC_REGION_AU915;    /* Region:EU868*/
lmh_confirm g_CurrentConfirm = LMH_UNCONFIRMED_MSG;				  /* confirm/unconfirm packet definition*/
uint8_t gAppPort = LORAWAN_APP_PORT;							        /* data port*/

/**@brief Structure containing LoRaWan parameters, needed for lmh_init()
*/
static lmh_param_t g_lora_param_init = {LORAWAN_ADR_ON, LORAWAN_DATERATE, LORAWAN_PUBLIC_NETWORK, JOINREQ_NBTRIALS, LORAWAN_TX_POWER, LORAWAN_DUTYCYCLE_OFF};

// Foward declaration
static void lorawan_has_joined_handler(void);
static void lorawan_join_failed_handler(void);
static void lorawan_rx_handler(lmh_app_data_t *app_data);
static void lorawan_confirm_class_handler(DeviceClass_t Class);
static void send_lora_frame(uint8_t* signature, unsigned long pulseCount);


/**@brief Structure containing LoRaWan callback functions, needed for lmh_init()
*/
static lmh_callback_t g_lora_callbacks = {BoardGetBatteryLevel, BoardGetUniqueId, BoardGetRandomSeed,
                                        lorawan_rx_handler, lorawan_has_joined_handler, lorawan_confirm_class_handler, lorawan_join_failed_handler
                                       };
//OTAA keys !!!! KEYS ARE MSB !!!!
uint8_t nodeDeviceEUI[8] = // REMOVED
uint8_t nodeAppEUI[8] = // REMOVED
uint8_t nodeAppKey[16] = // REMOVED



// Private defination
#define LORAWAN_APP_DATA_BUFF_SIZE 68                     /**< buffer size of the data to be transmitted. */
#define LORAWAN_APP_INTERVAL 20000                        /**< Defines for user timer, the application data transmission interval. 20s, value in [ms]. */
static uint8_t m_lora_app_data_buffer[LORAWAN_APP_DATA_BUFF_SIZE];            //< Lora user application data buffer.
static lmh_app_data_t m_lora_app_data = {m_lora_app_data_buffer, 0, 0, 0, 0}; //< Lora user application data structure.

TimerEvent_t appTimer;
static uint32_t timers_init(void);
static uint32_t count = 0;
static uint32_t count_fail = 0;

bool pulseLED = false;
// Energy measurement
// Energy meter constants
const float pulsesPerKWh = 1000; // Update this value based on your smart meter's pulses per kWh
const int threshold = 500; // Set the threshold value for detecting a pulse (between 100 and 900)
// Pulse counter
unsigned long pulseCount = 0;
// Pulse detection state machine
enum class PulseState { IDLE, DETECTED } currentState = PulseState::IDLE;
// Timing variables
unsigned long lastEnergyPrintTime = 0;
const unsigned long energyPrintInterval = 10000; // Print energy usage every 10 seconds (10000 ms)
const unsigned long debounceDelay = 100; // Adjust this value for debouncing

    // Declare the private and public key arrays
    uint8_t privateKey[32];
    uint8_t publicKey[32];

    // Define the DER encoded private and public keys as strings
    const char* privateKeyDERString = // REMOVED
    const char* publicKeyDERString = "302a300506032b6570032100bd0cda6ee60df41d2768df4c6bf011aa7dac9a0763863d3d998f66b65691b5bd";

uint8_t signature[64];  // Globally defined signature

unsigned long lastSendTime = 0; // When the last signature was sent
unsigned long sendInterval = 20000; // Send every 20 seconds

void setup()
{
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(PHOTO_TRANSISTOR_PIN, INPUT);
  digitalWrite(LED_BUILTIN, LOW);

  // Initialize Serial for debug output
  time_t timeout = millis();
  Serial.begin(115200);
  while (!Serial)
  {
    if ((millis() - timeout) < 5000)
    {
      delay(100);
    }
    else
    {
      break;
    }
  }

  // Initialize LoRa chip.
  lora_rak4630_init();

  Serial.println("=====================================");
  Serial.println("Welcome to RAK4630 LoRaWan!!!");
  if (doOTAA)
  {
    Serial.println("Type: OTAA");
  }
  else
  {
    Serial.println("Type: ABP");
  }

  switch (g_CurrentRegion)
  {
    case LORAMAC_REGION_AS923:
      Serial.println("Region: AS923");
      break;
    case LORAMAC_REGION_AU915:
      Serial.println("Region: AU915");
      break;
    case LORAMAC_REGION_CN470:
      Serial.println("Region: CN470");
      break;
  case LORAMAC_REGION_CN779:
    Serial.println("Region: CN779");
    break;
    case LORAMAC_REGION_EU433:
      Serial.println("Region: EU433");
      break;
    case LORAMAC_REGION_IN865:
      Serial.println("Region: IN865");
      break;
    case LORAMAC_REGION_EU868:
      Serial.println("Region: EU868");
      break;
    case LORAMAC_REGION_KR920:
      Serial.println("Region: KR920");
      break;
    case LORAMAC_REGION_US915:
      Serial.println("Region: US915");
    break;
  case LORAMAC_REGION_RU864:
    Serial.println("Region: RU864");
    break;
  case LORAMAC_REGION_AS923_2:
    Serial.println("Region: AS923-2");
    break;
  case LORAMAC_REGION_AS923_3:
    Serial.println("Region: AS923-3");
    break;
  case LORAMAC_REGION_AS923_4:
    Serial.println("Region: AS923-4");
      break;
  }
  Serial.println("=====================================");



  // Setup the EUIs and Keys
  if (doOTAA)
  {
    lmh_setDevEui(nodeDeviceEUI);
    lmh_setAppEui(nodeAppEUI);
    lmh_setAppKey(nodeAppKey);
  }
  else
  {
    lmh_setNwkSKey(nodeNwsKey);
    lmh_setAppSKey(nodeAppsKey);
    lmh_setDevAddr(nodeDevAddr);
  }

  Serial.println("lmh_init");
  uint32_t err_code;
  // Initialize LoRaWan
  err_code = lmh_init(&g_lora_callbacks, g_lora_param_init, doOTAA, g_CurrentClass, g_CurrentRegion);
  if (err_code != 0)
  {
    Serial.printf("lmh_init failed - %d\n", err_code);
    return;
  }

  // Start Join procedure
  Serial.println("lmh_join");
  lmh_join();
}

void loop()
{
  if (pulseLED)
  {
    digitalWrite(LED_BUILTIN, HIGH); // Turn on the LED
    delay(200);                     // Delay for 1 second
    digitalWrite(LED_BUILTIN, LOW);  // Turn off the LED
    pulseLED = false;                // Reset the pulseLED variable
  }
  int sensorValue = analogRead(PHOTO_TRANSISTOR_PIN);
    // Detect rising edge
  if (currentState == PulseState::IDLE && sensorValue < threshold) {
    currentState = PulseState::DETECTED;
    digitalWrite(LED_BUILTIN2, HIGH); // turn on LED when pulse is detected
    pulseCount++;
  }
  // Detect falling edge
  else if (currentState == PulseState::DETECTED && sensorValue >= threshold) {
    currentState = PulseState::IDLE;
    digitalWrite(LED_BUILTIN2, LOW); // turn off LED when detection stops
  }

    // Check if it's time to send a signature
  if (millis() - lastSendTime >= sendInterval) {
    // Sign the pulseCount and send it
    uint8_t signature[64];
    sign_data(pulseCount, signature);
    send_lora_frame(signature, pulseCount);
    pulseCount = 0;

    lastSendTime = millis(); // Update the last send time
  }

  delay(debounceDelay); // Add a debounce delay
}

/**@brief LoRa function for handling HasJoined event.
 */
void lorawan_has_joined_handler(void)
{
      Serial.println("lorawan_has_joined_handler");
  if(doOTAA == true)
  {
  Serial.println("OTAA Mode, Network Joined!");
  }
  else
  {
    Serial.println("ABP Mode");
  }

  lmh_error_status ret = lmh_class_request(g_CurrentClass);
  if (ret == LMH_SUCCESS)
  {
    delay(1000);
    Serial.println("Join success");
  }
}
/**@brief LoRa function for handling OTAA join failed
*/
static void lorawan_join_failed_handler(void)
{
  Serial.println("OTAA join failed!");
  Serial.println("Check your EUI's and Keys's!");
  Serial.println("Check if a Gateway is in range!");
}
/**@brief Function for handling LoRaWan received data from Gateway
 *
 * @param[in] app_data  Pointer to rx data
 */
void lorawan_rx_handler(lmh_app_data_t *app_data)
{
  Serial.printf("LoRa Packet received on port %d, size:%d, rssi:%d, snr:%d, data:%s\n",
          app_data->port, app_data->buffsize, app_data->rssi, app_data->snr, app_data->buffer);
}

void lorawan_confirm_class_handler(DeviceClass_t Class)
{
  Serial.printf("switch to class %c done\n", "ABC"[Class]);
  // Informs the server that switch has occurred ASAP
  m_lora_app_data.buffsize = 0;
  m_lora_app_data.port = gAppPort;
  lmh_send(&m_lora_app_data, g_CurrentConfirm);
}

size_t getArraySize(uint8_t* arr) {
    size_t size = 0;
    while (arr[size] != '\0') {
        size++;
    }
    return size;
}

void send_lora_frame(uint8_t* signature, unsigned long pulseCount) {
    Serial.println("send_lora_frame");

    lmh_join_status status = lmh_join_status_get();
    Serial.print("Join status: ");
    Serial.println(status);

    memset(m_lora_app_data.buffer, 0, LORAWAN_APP_DATA_BUFF_SIZE);
    m_lora_app_data.port = gAppPort;

    // Add the signature to the buffer
    for(int j = 0; j < 64; j++) {
        m_lora_app_data.buffer[j] = signature[j];
    }

    // Add the pulseCount to the buffer
    m_lora_app_data.buffer[64] = (pulseCount >> 24) & 0xFF; // MSB
    m_lora_app_data.buffer[64 + 1] = (pulseCount >> 16) & 0xFF;
    m_lora_app_data.buffer[64 + 2] = (pulseCount >> 8) & 0xFF;
    m_lora_app_data.buffer[64 + 3] = pulseCount & 0xFF; // LSB

    m_lora_app_data.buffsize = LORAWAN_APP_DATA_BUFF_SIZE;

    String bufferHexString = "";
    for(int i = 0; i < m_lora_app_data.buffsize; i++) {
        bufferHexString += String(m_lora_app_data.buffer[i], HEX);
    }
    Serial.print("Buffer contents (hex): ");
    Serial.println(bufferHexString);

    if (status != LMH_SET)
    {
        //Not joined, try again later
        return;
    }

    lmh_error_status error = lmh_send(&m_lora_app_data, g_CurrentConfirm);
    if (error == LMH_SUCCESS)
    {
        count++;
        Serial.printf("lmh_send ok count %d\n", count);
        pulseLED = true; // Set pulseLED to true
    }
    else
    {
        count_fail++;
        Serial.printf("lmh_send fail count %d\n", count_fail);
    }
}

void sign_data(unsigned long pulseCount, uint8_t* signature) {
  Serial.println("sign_data");

  hexStringToByteArray(privateKeyDERString, privateKey, sizeof(privateKey));
  hexStringToByteArray(publicKeyDERString, publicKey, sizeof(publicKey));

  // Convert pulseCount to a byte array
  uint8_t data[4];
  data[0] = (pulseCount >> 24) & 0xFF; // MSB
  data[1] = (pulseCount >> 16) & 0xFF;
  data[2] = (pulseCount >> 8) & 0xFF;
  data[3] = pulseCount & 0xFF; // LSB

  // Calculate the length of the data
  size_t dataLength = sizeof(data);

  // Sign the data
  Ed25519::sign(signature, privateKey, publicKey, data, dataLength);

  // Print the signature
  Serial.println("Signature:");
  for(int i = 0; i < 64; i++) {
    if(signature[i] < 16) {
      Serial.print("0");  // Print an extra 0 for single-digit hex values
    }
    Serial.print(signature[i], HEX);
  }
  Serial.println();
}

void hexStringToByteArray(const char* hexString, uint8_t* byteArray, size_t byteArraySize) {
  size_t hexStringLength = strlen(hexString);
  size_t byteCount = hexStringLength / 2;
  if (byteCount > byteArraySize) {
    byteCount = byteArraySize;
  }

  for (size_t i = 0; i < byteCount; i++) {
    char hexChars[3];
    hexChars[0] = hexString[i * 2];
    hexChars[1] = hexString[i * 2 + 1];
    hexChars[2] = '\0';

    byteArray[i] = strtol(hexChars, nullptr, 16);
  }
}

