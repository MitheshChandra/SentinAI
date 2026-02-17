provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "sentinai_server" {
  ami           = "ami-0c7217cdde317cfec" # Ubuntu 22.04
  instance_type = "t3.xlarge"
  key_name      = "sentinai-deploy"

  tags = {
    Name = "SentinAI-Platform"
    Environment = "Production"
  }
}

resource "aws_security_group" "k8s_sg" {
  name        = "k8s-security-group"
  description = "Allow K8s and SSH"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
