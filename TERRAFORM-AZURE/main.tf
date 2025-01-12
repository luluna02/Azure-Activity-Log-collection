
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.0.0"
    }
  }
}

provider "azurerm" {
  features {}
}


data "azurerm_subscription" "primary" {
}

data "azurerm_resource_group" "example" {
  name = "RG-SUM24-LF"
}

resource "azurerm_monitor_action_group" "main" {
  name                = "example-actiongroup"
  resource_group_name = data.azurerm_resource_group.example.name
  short_name          = "exampleact"

  webhook_receiver {
    name        = "webhook"
    service_uri = "http://alertwebhook.fpepf2ekgbg7e3bj.eastus.azurecontainer.io:3000/"
    
  }
}

resource "azurerm_monitor_activity_log_alert" "main" {
  name                = "Activity log alert for webhook"
  resource_group_name = data.azurerm_resource_group.example.name
  scopes              = [data.azurerm_subscription.primary.id]
  description         = "Alerts are fired when a change of resource is detected."

  criteria {
    category       = "Administrative"
  }

  action {
    action_group_id = azurerm_monitor_action_group.main.id
  }
}




