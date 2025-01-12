# Azure Activity Log Data Collection System

## Project Overview

This project is a solution to collect and store Azure Activity Log data for later investigations. The system uses Terraform for infrastructure configuration, Azure MySQL for storage, and a webhook built with Node.js and Express.js to receive and store alert data and Azure Container Registries/Instances for deployment.

## Key Components

1. **Webhook**:  
   - Built using Node.js and Express.js, the webhook collects alert data from Azure in JSON format.
   - The webhook is deployed on Azure Container Instances (ACI) to receive alerts and store them in the Azure MySQL database.
   
2. **Azure MySQL**:  
   - The collected data is stored in a MySQL database hosted on Azure.
   
3. **Docker**:  
   - The webhook server is containerized and deployed to Azure Container Registry and Azure Container Instances for scalability and easy deployment.

4. **Terraform**:  
   - Used to automate the provisioning of Azure resources, including the action group for alerts and MySQL database on Azure.

## Workflow

1. **Configure Azure Subscription Alerts**:  
   - An alert is created for the entire Azure subscription using Terraform, which triggers notifications on activity log changes.
   
2. **Webhook for Data Collection**:  
   - The webhook receives alert notifications from Azure and stores the data in the MySQL database.

3. **Cloud Migration**:  
   - After testing locally, the system is migrated to the cloud:
     - A MySQL database is created on Azure.
     - The webhook server is containerized and deployed using Azure Container Registry.
     - The webhook URI is updated in the Azure action group to point to the deployed webhook container.

4. **Automation with Terraform**:  
   - All infrastructure resources, including the action group, webhook, and database, are provisioned automatically using Terraform.

## Deployment

### Prerequisites

- **Terraform**: Ensure Terraform is installed and configured.
- **Node.js**: Ensure Node.js and npm are installed to run the webhook locally (for testing).
- **Docker**: Required for containerizing the webhook service.
- **Azure Account**: Set up with permissions to create resources such as MySQL, Container Instances, and Container Registries.

### Steps

1. Clone the repository to your local machine.
2. Configure the Terraform scripts with your Azure credentials.
3. Apply the Terraform scripts to provision the necessary Azure resources.
4. Build and run the webhook locally (for testing) or containerize it and deploy it to Azure.
5. Once the system is working locally, push the Docker image to Azure Container Registry.
6. Update the action group in Azure to point to the deployed webhook URI.
7. The system will now collect and store Activity Log Alerts in the Azure MySQL database.

### Testing

- You can manually trigger alerts in Azure to test if the webhook is properly receiving and storing data.
- Query the MySQL database to verify that the alerts are stored correctly.

## Conclusion

This project demonstrates how to automate the collection and storage of Azure Activity Log Alerts for anomaly detection using Azure services.
