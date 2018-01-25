FROM centos:latest

MAINTAINER Justin W. Flory <jflory@unicef.org>
LABEL vendor="UNICEF Office of Innovation"

ENV HOME /root
WORKDIR /root

RUN yum upgrade -y \
    && yum install -y \
        curl \
        git \
        node \
        postgresql \
        sudo \
        unzip \
        wget \
    && yum clean all

# Add NodeJS 8 package
# https://github.com/nodesource/distributions#rpm
RUN curl -sL https://rpm.nodesource.com/setup_8.x | bash -
RUN yum install -y nodejs

# Set up coordinate_to_admin_id_server
RUN git clone https://github.com/unicef/coordinates_to_admin_id_server \
    && cd coordinates_to_admin_id_server \
    && npm install

WORKDIR coordinates_to_admin_id_server

ENTRYPOINT ["npm", "run", "build"]
