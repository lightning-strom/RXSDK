package com.ruixue.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.ruixue.legal.LegalData;
import com.ruixue.ui.R;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class PermissionAdapter extends BaseAdapter {

    private final Context mContext;
    private final boolean isLandscape;
    private final List<LegalData.PermissionItem> dataList = new ArrayList<>();
//    private static final HashMap<String, Integer> iconResMap = new HashMap<>();
//
//    static {
//        iconResMap.put("phone", R.drawable.rx_permission_phone);
//        iconResMap.put("storage", R.drawable.rx_permission_stoage);
//        iconResMap.put("mic", R.drawable.rx_permission_music);
//        iconResMap.put("camera", R.drawable.rx_permission_camera);
//        iconResMap.put("locate", R.drawable.rx_permission_locate);
//        iconResMap.put("call", R.drawable.rx_permission_call);
//    }

    public PermissionAdapter(Context context, List<LegalData.PermissionItem> permission, boolean isLandscape) {
        this.mContext = context;
        if (permission != null) {
            for (int i = 0; i < permission.size(); i++) {
                LegalData.PermissionItem listBean = permission.get(i);
                if (listBean.isEnable()) {
                    dataList.add(listBean);
                }
            }
        }
        this.isLandscape = isLandscape;
    }


    @Override
    public int getCount() {
        return dataList.size();
    }

    @Override
    public Object getItem(int position) {
        if (position >= 0 && position < dataList.size()) {
            return dataList.get(position);
        } else {
            return null;
        }
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder viewHolder;
        if (convertView == null) {

            convertView = LayoutInflater.from(mContext).inflate(R.layout.rx_permission_item, parent, false);


            viewHolder = new ViewHolder();
//            viewHolder.image = convertView.findViewById(R.id.image);
            viewHolder.title = convertView.findViewById(R.id.title);
            viewHolder.context = convertView.findViewById(R.id.content);
            convertView.setTag(viewHolder);

        } else {
            viewHolder = (ViewHolder) convertView.getTag();
        }
        if (dataList.size() > 0) {
            LegalData.PermissionItem perssiomEntry = dataList.get(position);
//            Integer resId = iconResMap.get(perssiomEntry.getKey());
//            if (resId != null) {
//                viewHolder.image.setImageResource(resId);
//            }
            viewHolder.title.setText(perssiomEntry.getName());
            viewHolder.context.setText(perssiomEntry.getContent());
        }
        // 这里只是模拟，实际开发可能需要加载网络图片，可以使用ImageLoader这样的图片加载框架来异步加载图片
        return convertView;
    }


    static class ViewHolder {
//        ImageView image;
        TextView title;
        TextView context;
    }
}