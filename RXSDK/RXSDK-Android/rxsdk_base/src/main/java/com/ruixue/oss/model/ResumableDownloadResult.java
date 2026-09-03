package com.ruixue.oss.model;

public class ResumableDownloadResult extends OSSResult {

    private ObjectMetadata metadata;

    /**
     * Gets the metadata
     *
     * @return object metadata
     */
    public ObjectMetadata getMetadata() {
        return metadata;
    }

    public void setMetadata(ObjectMetadata metadata) {
        this.metadata = metadata;
    }
}
