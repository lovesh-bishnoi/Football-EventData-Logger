# Simplified Cloud-Native Football Data Logger
Welcome to the Simplified Cloud-Native Football Data Logger project! In this repository, I have designed and implemented an efficient cloud-native application that provides users with the capability to log football data events and retrieve them seamlessly through a user-friendly API.

## Technology Stack
* **Infrastructure as Code (IAC):** The project utilizes the power of AWS CDK (Cloud Development Kit) for defining infrastructure as code. The entire infrastructure is defined programmatically, ensuring repeatability and scalability.

* **Programming Languages:**
  * **TypeScript:** The project leverages TypeScript for defining infrastructure and ensuring type safety throughout the codebase.
  * **Python:** AWS Lambda functions are implemented using Python to efficiently process and handle data events.
## Key Features
* **Data Logging:** The application offers a straightforward method for logging football data events. Users can submit JSON payloads representing various football events, such as goals, fouls, substitutions, and more.

* **Data Retrieval:** Retrieving logged football events is a breeze. The API is designed to provide easy access to both individual event details and comprehensive event lists.

Feel free to explore the code, documentation, and API endpoints to gain insights into the implementation of this cloud-native football data logger. If you have any questions or feedback, please don't hesitate to get in touch. Enjoy exploring!

## **Detailed Requirements:**
This section outlines the detailed requirements for the Sports Event Logger project. These requirements provide a clear and comprehensive overview of the key components and functionalities of the application.

**1. Data Logging**
  * **AWS API Gateway:**
    Utilize AWS API Gateway to create a RESTful API that serves as the entry point for logging sports events. API Gateway ensures secure and scalable access to the application.
  * **AWS Lambda Function:** 
    Implement an AWS Lambda function that acts as the backend handler for processing and logging sports events. The Lambda function is responsible for receiving and validating JSON payloads representing sports events, such as goals scored in a football match.
  * **Example Endpoint:**
    Define an example endpoint within the API to receive event data:
      * Endpoint: POST /events
      * This endpoint will be used for submitting sports event data to the application.
  
**2. Data Storage**
  * **AWS DynamoDB:**
    Employ AWS DynamoDB as the primary data storage service for the application. DynamoDB is a highly scalable NoSQL database that ensures fast and efficient data storage and retrieval.
  * **DynamoDB Table:**
    Create a DynamoDB table specifically designed to store the logged sports events. The schema of the table should be optimized for the efficient querying of event data.

**3. Data Retrieval**
  * **AWS Lambda Functions:**
    Implement additional AWS Lambda functions to handle the retrieval of logged sports events through the API. These functions serve as the backend logic for retrieving event data.
  * **API Endpoints:**
    Define the following API endpoints to facilitate data retrieval:
      * GET /events: This endpoint allows users to retrieve a list of all logged sports events. It provides an overview of all recorded events.
      * GET /events/{event_id}: This endpoint enables users to retrieve detailed information about a single sports event by specifying its unique event ID.

**4. Infrastructure as Code (IaC)**
  * **AWS CDK:**
    The cloud resources and infrastructure for this project are defined using the AWS CDK (Cloud Development Kit). AWS CDK allows for the programmatic and repeatable provisioning of AWS resources, ensuring consistency and ease of management.

These detailed requirements serve as a blueprint for the implementation of the Sports Event Logger application. They specify the necessary components and functionalities, ensuring a clear understanding of the project's scope and objectives. Developers can refer to these requirements to guide the development and deployment of the application.

## Examples (Useful Commands):
### **1. Data Logging Endpoint**

  **Request**
  * Method: POST
    * Endpoint: /events
    * Body:
    ```
        {
            "timestamp": "2023-06-22T19:45:30Z",
            "team": "Real Madrid",
            "opponent": "FC Barcelona",
            "event_type": "goal",
            "event_details": {
                "player": {
                    "name": "Cristiano Ronaldo",
                    "position": "Forward",
                    "number": 7
                },
                "goal_type": "freekick",
                "minute": 93
            }
        }
    ```
      
  **Response**
  * Status Code: 201 Created
  * Body:
  ```
  {
      "status": "success",
      "message": "Event successfully logged.",
      "event_id": "xyz123"
  }
  ```

### **2. Retrieve All Events Endpoint**

  **Request**
  * Method: GET
  * Endpoint: /events

  **Response**
  * Status Code: 201 Created
  * Body:
  ```
  {
      "status": "success",
      "events": [
          {
              "event_id": "abc123",
              "timestamp": "2023-06-22T19:45:30Z",
              "team": "Real Madrid",
              "opponent": "FC Barcelona",
              "event_type": "goal",
              "event_details": {
                  "player": {
                      "name": "Cristiano Ronaldo",
                      "position": "Forward",
                      "number": 7
                  },
                  "goal_type": "header",
                  "minute": 39
              }
          }
      ]
  }
  ```
      
### **3. Retrieve Single Events Endpoint**

  **Request**
  * Method: GET
  * Endpoint: /events/xyz123

  **Response**
  * Status Code: 200 Ok
  * Body:
  ```
  {
      "status": "success",
      "event": {
          "event_id": "abc123",
          "timestamp": "2023-06-22T19:45:30Z",
          "team": "Real Madrid",
          "opponent": "FC Barcelona",
          "event_type": "goal",
          "event_details": {
              "player": {
                  "name": "Cristiano Ronaldo",
                  "position": "Forward",
                  "number": 7
              },
              "goal_type": "penalty",
              "minute": 21
          }
      }
  }
  ```

## Why This Project?
This project serves as a practical demonstration of cloud-native application development, showcasing best practices in infrastructure as code and serverless architecture. It provides a solid foundation for building similar systems, not limited to football data, and can serve as a valuable reference for cloud-native developers.
