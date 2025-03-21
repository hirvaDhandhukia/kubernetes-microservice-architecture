# Terraform configuration for creating GKE cluster

# Define the Google Cloud provider
provider "google" {
  credentials = file("./k8s-hirva-3ccb798c8225.json")  # service account key file
  project     = "k8s-hirva"  # Replace with your Google Cloud project ID
  region      = "us-central1"
}

# Define the GKE cluster
resource "google_container_cluster" "kube_cluster" {
  name     = "kube-cluster"  # Name of cluster
  location = "us-central1-c"  # Zone for cluster

  # Autopilot set to false (we are using standard cluster)
  enable_autopilot = false

  # requirement: one node 
  initial_node_count = 1

  # Node configurations
  node_config {
    machine_type = "e2-medium"  # Machine type for nodes
    disk_size_gb = 20  # Disk size for nodes
    disk_type    = "pd-standard"  # standard persistent disk <type>
    image_type   = "COS_CONTAINERD"  # Container-Optimized OS with containerd

    # Enable workload identity 
    # workload_metadata_config {
    #   mode = "GKE_METADATA"
    # }
  }

  # Enable Kubernetes API
  addons_config {
    http_load_balancing {
      disabled = false
    }
    horizontal_pod_autoscaling {
      disabled = false
    }
  }

  # Enable network policy
  # network_policy {
  #   enabled = true
  # }

  # Enable private cluster
  private_cluster_config {
    enable_private_nodes    = false
    enable_private_endpoint = false
  }
}

# Output the cluster name and zone
output "cluster_name" {
  value = google_container_cluster.kube_cluster.name
}

output "cluster_zone" {
  value = google_container_cluster.kube_cluster.location
}
