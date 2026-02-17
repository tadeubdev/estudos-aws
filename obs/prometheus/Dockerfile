FROM prom/prometheus:v2.54.1

# Copia a config para dentro da imagem
COPY prometheus.yml /etc/prometheus/prometheus.yml

# Mantém os argumentos padrão (você ainda pode sobrescrever no docker run)
CMD ["--config.file=/etc/prometheus/prometheus.yml", "--storage.tsdb.retention.time=7d"]
